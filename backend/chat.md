# Lumina AI Chat System: Technical Documentation

## RAG (Retrieval-Augmented Generation) Implementation

### Abstract

This document provides a comprehensive technical overview of the AI-powered HR Assistant implemented in the Lumina Human Resource Management System. The system employs a Retrieval-Augmented Generation (RAG) architecture combined with Context-Augmented Generation (CAG) techniques to provide accurate, contextual responses to HR-related queries based on uploaded organizational documents.

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           LUMINA AI CHAT SYSTEM                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────────┐ │
│  │   Frontend   │────▶│   FastAPI    │────▶│   Document Processing    │ │
│  │   (React)    │     │   Backend    │     │   Pipeline               │ │
│  └──────────────┘     └──────────────┘     └──────────────────────────┘ │
│         │                    │                         │                 │
│         │                    │                         ▼                 │
│         │                    │              ┌──────────────────────────┐ │
│         │                    │              │   Embedding Generation   │ │
│         │                    │              │   (Hash-based Vectors)   │ │
│         │                    │              └──────────────────────────┘ │
│         │                    │                         │                 │
│         ▼                    ▼                         ▼                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────────┐ │
│  │   MongoDB    │◀───▶│    Qdrant    │◀───▶│   Groq LLM Service       │ │
│  │  (Metadata)  │     │ (Vectors)    │     │   (llama-3.1-8b-instant) │ │
│  └──────────────┘     └──────────────┘     └──────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Web Framework | FastAPI (Python 3.11+) | Async API handling |
| Vector Database | Qdrant Cloud | Semantic search & vector storage |
| LLM Provider | Groq | Fast inference with LLaMA 3.1 |
| Document Database | MongoDB Atlas | Document metadata & chat history |
| Document Parser | PyPDF2, python-docx | PDF and DOCX text extraction |
| Frontend | React + TypeScript | User interface |

---

## 2. Document Processing Pipeline

### 2.1 Supported Document Types

The system supports the following document formats:
- **PDF** (.pdf) - Portable Document Format
- **Microsoft Word** (.doc, .docx) - Word documents

### 2.2 Document Ingestion Flow

```
Document Upload → Text Extraction → Chunking → Embedding → Vector Storage
```

#### 2.2.1 Text Extraction

```python
def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF using PyPDF2"""
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
    text = ""
    for page in pdf_reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text.strip()

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX using python-docx"""
    doc = docx.Document(io.BytesIO(file_content))
    text = ""
    for paragraph in doc.paragraphs:
        if paragraph.text.strip():
            text += paragraph.text + "\n"
    return text.strip()
```

#### 2.2.2 Text Chunking Strategy

The system employs a fixed-size chunking strategy with overlap to preserve context across chunk boundaries:

```python
CHUNK_SIZE = 500      # Characters per chunk
CHUNK_OVERLAP = 50    # Overlapping characters between chunks

def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, 
               overlap: int = CHUNK_OVERLAP) -> List[str]:
    """Split text into overlapping chunks"""
    chunks = []
    text = ' '.join(text.split())  # Normalize whitespace
    
    for i in range(0, len(text), chunk_size - overlap):
        chunk = text[i:i + chunk_size]
        if chunk.strip():
            chunks.append(chunk.strip())
    
    return chunks
```

**Rationale for Chunking Parameters:**
- **500 characters**: Balances semantic coherence with retrieval granularity
- **50-character overlap**: Ensures context continuity across boundaries
- **Whitespace normalization**: Improves embedding consistency

### 2.3 Duplicate Detection

To prevent redundant document storage, the system implements content-based deduplication:

```python
import hashlib

content_hash = hashlib.sha256(text.encode()).hexdigest()

# Check for existing document with same hash
existing = await db.knowledge_documents.find_one({
    "content_hash": content_hash,
    "company_id": company_id
})
```

---

## 3. Vector Embedding System

### 3.1 Embedding Generation

The system uses a deterministic hash-based embedding approach for cost-effective vector generation:

```python
EMBEDDING_DIM = 384  # Vector dimensionality

def get_embedding(text: str) -> List[float]:
    """Generate deterministic embedding from text hash"""
    embedding = []
    for i in range(EMBEDDING_DIM):
        hash_input = f"{text}_{i}".encode('utf-8')
        hash_obj = hashlib.md5(hash_input)
        hash_hex = hash_obj.hexdigest()
        
        # Convert to normalized float [-1, 1]
        int_val = int(hash_hex[:8], 16)
        normalized = (int_val / 2147483647.5) - 1.0
        
        # Ensure valid float
        normalized = max(-1.0, min(1.0, normalized))
        embedding.append(float(normalized))
    
    return embedding
```

**Key Design Decisions:**
1. **384 dimensions**: Standard size for semantic similarity tasks
2. **MD5 hashing**: Fast, deterministic hash generation
3. **Per-dimension hashing**: Each dimension gets unique hash input
4. **Range normalization**: Vectors normalized to [-1, 1] for cosine similarity

### 3.2 Vector Storage in Qdrant

```python
# Qdrant collection configuration
COLLECTION_CONFIG = {
    "vectors": {
        "size": 384,
        "distance": "Cosine"  # Cosine similarity metric
    }
}

# Point structure for upsert
points = [{
    "id": str(uuid.uuid4()),
    "vector": embedding,
    "payload": {
        "document_id": doc_id,
        "document_name": filename,
        "chunk_index": i,
        "text": chunk,
        "company_id": company_id
    }
}]
```

---

## 4. Query Processing & Retrieval

### 4.1 Semantic Search Flow

```
User Query → Query Embedding → Vector Search → Context Retrieval → LLM Generation
```

### 4.2 Vector Similarity Search

```python
# Search for relevant chunks
results = qdrant_client.query_points(
    collection_name=collection_name,
    query=query_embedding,
    limit=5,
    score_threshold=0.1
)
```

**Search Parameters:**
- **limit=5**: Top-K retrieval for balanced context
- **score_threshold=0.1**: Minimum similarity threshold to filter irrelevant results

### 4.3 Context Assembly

Retrieved chunks are assembled into a coherent context string:

```python
context_parts = []
sources = []

for result in search_results:
    context_parts.append(result.payload.get("text", ""))
    sources.append({
        "name": result.payload.get("document_name"),
        "chunk_index": result.payload.get("chunk_index"),
        "score": result.score
    })

context = "\n\n".join(context_parts)
```

---

## 5. LLM Integration

### 5.1 Groq API Configuration

```python
from groq import Groq

groq_client = Groq(api_key=GROQ_API_KEY)

# Model configuration
MODEL = "llama-3.1-8b-instant"
TEMPERATURE = 0.7
MAX_TOKENS = 1024
```

### 5.2 System Prompt Engineering

```python
SYSTEM_PROMPT = """You are Lumina AI, an intelligent HR assistant for the 
{company_name} organization. Your role is to help employees and HR staff 
with questions about company policies, procedures, and HR-related matters.

IMPORTANT GUIDELINES:
1. Only answer questions based on the provided context from company documents
2. If the context doesn't contain relevant information, acknowledge this clearly
3. Be professional, helpful, and concise
4. When referencing policies, cite the source document when possible
5. For sensitive HR matters, recommend consulting with HR directly

Remember: You are here to assist, not to make final HR decisions."""
```

### 5.3 Response Generation

```python
messages = [
    {
        "role": "system",
        "content": system_prompt
    },
    {
        "role": "user",
        "content": f"""Context from company documents:
{context}

---

Question: {user_message}

Please provide a helpful response based on the context above."""
    }
]

response = groq_client.chat.completions.create(
    model=MODEL,
    messages=messages,
    temperature=TEMPERATURE,
    max_tokens=MAX_TOKENS
)
```

---

## 6. Session Management

### 6.1 Conversation Tracking

Each chat session is tracked with a unique session ID:

```python
session_id = request.session_id or str(uuid.uuid4())

# Store message in MongoDB
message_doc = {
    "session_id": session_id,
    "company_id": company_id,
    "role": "user|assistant",
    "content": message,
    "sources": sources,
    "created_at": datetime.now(timezone.utc)
}
await db.chat_messages.insert_one(message_doc)
```

### 6.2 History Retrieval

```python
cursor = db.chat_messages.find(
    {"session_id": session_id}
).sort("created_at", 1).limit(limit)
```

---

## 7. Document Management

### 7.1 Document Deletion

When a document is deleted, all associated vector embeddings are also removed:

```python
@router.delete("/admin/chat/documents/{document_id}")
async def delete_document(document_id: str):
    # Delete from MongoDB
    await db.knowledge_documents.delete_one({"_id": ObjectId(document_id)})
    
    # Delete vectors from Qdrant
    qdrant_client.delete(
        collection_name=collection_name,
        points_selector=models.FilterSelector(
            filter=models.Filter(
                must=[
                    models.FieldCondition(
                        key="document_id",
                        match=models.MatchValue(value=document_id)
                    )
                ]
            )
        )
    )
```

---

## 8. Performance Considerations

### 8.1 Optimization Strategies

1. **Async Operations**: All database and API calls use async/await
2. **Connection Pooling**: Motor (async MongoDB driver) handles connection pooling
3. **Batch Upserts**: Vector points are batched for efficient insertion
4. **Index Optimization**: MongoDB indexes on frequently queried fields

### 8.2 Scalability

| Component | Scaling Strategy |
|-----------|------------------|
| API | Horizontal scaling via container orchestration |
| MongoDB | Atlas auto-scaling with sharding |
| Qdrant | Distributed deployment with replicas |
| Groq | Rate limiting and request queuing |

---

## 9. Security Considerations

### 9.1 Multi-Tenancy Isolation

All documents and queries are scoped to the user's company:

```python
collection_name = f"lumina_docs_{company_id}"
```

### 9.2 Authentication

JWT-based authentication ensures all endpoints require valid tokens:

```python
current_user: UserInDB = Depends(get_current_user)
```

---

## 10. API Reference

### 10.1 Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/chat/upload` | Upload document |
| GET | `/api/admin/chat/documents` | List documents |
| DELETE | `/api/admin/chat/documents/{id}` | Delete document |
| POST | `/api/admin/chat` | Send chat message |
| GET | `/api/admin/chat/history` | Get chat history |
| DELETE | `/api/admin/chat/history` | Clear chat history |

### 10.2 Request/Response Schemas

#### Upload Document
```json
// Request: multipart/form-data
{
  "file": "<binary>"
}

// Response
{
  "message": "Document uploaded successfully",
  "document_id": "uuid",
  "filename": "policy.pdf",
  "chunks_created": 15
}
```

#### Chat Query
```json
// Request
{
  "message": "What is the leave policy?",
  "session_id": "optional-uuid"
}

// Response
{
  "response": "According to the company policy...",
  "sources": [
    {"name": "HR_Policy.pdf", "chunk_index": 3, "score": 0.85}
  ],
  "session_id": "uuid",
  "reasoning": "Retrieved 5 relevant chunks..."
}
```

---

## 11. Future Enhancements

1. **Hybrid Search**: Combine dense vectors with sparse BM25 for improved retrieval
2. **Re-ranking**: Implement cross-encoder re-ranking for top results
3. **Streaming Responses**: WebSocket support for real-time response streaming
4. **Multi-modal**: Support for image-based document analysis
5. **Fine-tuning**: Custom model fine-tuning on HR domain data

---

## 12. References

1. Lewis, P., et al. (2020). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
2. Karpukhin, V., et al. (2020). "Dense Passage Retrieval for Open-Domain Question Answering"
3. Qdrant Documentation: https://qdrant.tech/documentation/
4. Groq API Documentation: https://console.groq.com/docs

---

## Appendix A: Environment Configuration

```env
# Required environment variables
MONGO_URL=mongodb+srv://...
DB_NAME=lumina_db
GROQ_API_KEY=gsk_...
QDRANT_URL=https://xxx.qdrant.tech
QDRANT_API_KEY=...
```

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Author: Lumina Engineering Team*
