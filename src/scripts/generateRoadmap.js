// Script to generate the single source of truth: src/data/roadmap.ts
// Calculates real calendar dates for 2026-2027, skipping the 12 holiday dates.

import fs from 'fs';
import path from 'path';

const START_DATE = '2026-10-08';

const HOLIDAYS = [
  // Durga Puja: 10 days off
  { date: '2026-10-16', name: 'Durga Puja — Maha Shashthi' },
  { date: '2026-10-17', name: 'Durga Puja — Maha Saptami' },
  { date: '2026-10-18', name: 'Durga Puja — Maha Ashtami' },
  { date: '2026-10-19', name: 'Durga Puja — Maha Navami (Sandhi Puja)' },
  { date: '2026-10-20', name: 'Durga Puja — Vijaya Dashami (Dussehra)' },
  { date: '2026-10-21', name: 'Durga Puja — Dashami Immersion' },
  { date: '2026-10-22', name: 'Durga Puja — Festive Rest Day' },
  { date: '2026-10-23', name: 'Durga Puja — Festive Rest Day' },
  { date: '2026-10-24', name: 'Durga Puja — Festive Rest Day' },
  { date: '2026-10-25', name: 'Durga Puja — Festive Rest Day' },
  // Diwali: 2 days off
  { date: '2026-11-08', name: 'Diwali — Lakshmi Puja' },
  { date: '2026-11-09', name: 'Diwali — Govardhan Puja & Nutan Varsh' },
];

const holidayMap = new Map(HOLIDAYS.map(h => [h.date, h.name]));

export const PHASES = [
  {
    id: 1,
    name: 'Software Engineering Foundation',
    startDay: 1,
    endDay: 15,
    learn: [
      'Python',
      'OOP',
      'Data Structures & Algorithms',
      'Git & GitHub',
      'APIs & REST',
      'SQL',
      'Linux & CLI',
      'Testing & Debugging'
    ],
    build: [
      'Production-ready Python API',
      'AI-powered backend with FastAPI'
    ],
    outcome: 'Solid software engineering foundation with production-grade Python APIs, rigorous testing, and async FastAPI backend.'
  },
  {
    id: 2,
    name: 'ML + Deep Learning Concepts',
    startDay: 16,
    endDay: 30,
    learn: [
      'Linear Algebra',
      'Probability & Statistics',
      'Machine Learning Fundamentals',
      'Neural Networks',
      'Transformers',
      'Embeddings',
      'PyTorch',
      'Training vs Inference',
      'Model Evaluation'
    ],
    build: [
      'Train and deploy an ML model',
      'Fine-tune a small transformer model'
    ],
    outcome: 'Deep conceptual and hands-on grasp of mathematical foundations, PyTorch tensor workflows, classical ML deployment, and Transformer fine-tuning.'
  },
  {
    id: 3,
    name: 'LLM Engineering',
    startDay: 31,
    endDay: 45,
    learn: [
      'LLM APIs',
      'Prompt Engineering',
      'Structured Outputs',
      'Function Calling',
      'Embeddings',
      'Vector Databases',
      'RAG',
      'Chunking & Retrieval',
      'Reranking',
      'Context Management'
    ],
    build: [
      'Production-grade RAG application',
      'Multi-document research assistant'
    ],
    outcome: 'Mastery of LLM API integration, structured schema generation, vector search, hybrid retrieval, and production RAG pipelines.'
  },
  {
    id: 4,
    name: 'Agentic AI',
    startDay: 46,
    endDay: 60,
    learn: [
      'AI Agents',
      'Tool Use',
      'Function Calling',
      'Agent Workflows',
      'ReAct',
      'Planning',
      'Memory',
      'Multi-Agent Systems',
      'MCP',
      'Human-in-the-Loop'
    ],
    build: [
      'Autonomous research agent',
      'Coding agent',
      'Multi-agent workflow'
    ],
    outcome: 'Production-grade agent architectures including ReAct loops, stateful workflows, tool execution, MCP servers, and collaborative multi-agent swarms.'
  },
  {
    id: 5,
    name: 'Evaluation + Production AI',
    startDay: 61,
    endDay: 75,
    learn: [
      'LLM Evaluation',
      'Automated Evals',
      'LLM-as-a-Judge',
      'Failure Analysis',
      'Hallucination Testing',
      'Guardrails',
      'Observability',
      'Tracing',
      'Latency Optimization',
      'Cost Optimization',
      'Reliability'
    ],
    build: [
      'Evaluation framework for your AI app',
      'AI observability dashboard'
    ],
    outcome: 'End-to-end evaluation, benchmarking, hallucination prevention, distributed telemetry, and enterprise-grade reliability & cost optimization.'
  },
  {
    id: 6,
    name: 'Deployment + Systems',
    startDay: 76,
    endDay: 90,
    learn: [
      'Docker',
      'Kubernetes',
      'CI/CD',
      'Cloud Platforms',
      'Model Serving',
      'Distributed Systems',
      'GPU Inference',
      'Caching',
      'Message Queues',
      'Monitoring',
      'AI Security'
    ],
    build: [
      'Deploy your AI system to the cloud',
      'Add CI/CD and monitoring'
    ],
    outcome: 'Enterprise cloud infrastructure, container orchestration, high-throughput GPU model serving, CI/CD automated test suites, and 24/7 monitoring.'
  }
];

// Definition of the 90 curriculum days
const STUDY_DAYS_BLUEPRINT = [
  // --- PHASE 1: Days 1-15 (Software Engineering Foundation) ---
  {
    day: 1,
    phaseId: 1,
    topics: ['Python Essentials, Memory Layout & Virtual Environments'],
    isBuildDay: false,
    timeSplit: '2h Concept / 2.5h Practice / 1h Review',
    practiceTask: 'Set up virtualenv/uv, inspect object mutability & id/ref-counting, implement custom context managers.',
    doneWhen: 'Clean Python 3.12 environment initialized with working custom context manager and written memory notes.'
  },
  {
    day: 2,
    phaseId: 1,
    topics: ['OOP & Clean Code Principles in Python'],
    isBuildDay: false,
    timeSplit: '2h Concept / 2.5h Practice / 1h Review',
    practiceTask: 'Build a modular class hierarchy using abstract base classes (abc), dataclasses, Pydantic v2 schemas, and dunder methods.',
    doneWhen: 'Complete domain model implemented with strict type annotations and Pydantic validation.'
  },
  {
    day: 3,
    phaseId: 1,
    topics: ['Data Structures & Algorithms I: Arrays, Strings, Two Pointers & Hash Maps'],
    isBuildDay: false,
    timeSplit: '1.5h Theory / 3h LeetCode / 1h Complexity Analysis',
    practiceTask: 'Implement and solve 5 core DSA problems on Two Pointers, Sliding Window, and Hash Map frequency tracking with Big-O trade-offs.',
    doneWhen: '5 LeetCode medium problems solved in Python with optimal O(N) time and space complexity explanations.'
  },
  {
    day: 4,
    phaseId: 1,
    topics: ['Data Structures & Algorithms II: Linked Lists, Stacks, Queues & Trees'],
    isBuildDay: false,
    timeSplit: '1.5h Theory / 3h LeetCode / 1h Review',
    practiceTask: 'Code Linked List reversals, Monotonic Stack for next greater element, and recursive Tree traversals (In/Pre/Post-order).',
    doneWhen: 'Core tree and stack algorithms implemented from scratch without library shortcuts.'
  },
  {
    day: 5,
    phaseId: 1,
    topics: ['Data Structures & Algorithms III: Recursion, Binary Search & Graph BFS/DFS'],
    isBuildDay: false,
    timeSplit: '1.5h Theory / 3h Coding / 1h Analysis',
    practiceTask: 'Write binary search variants on rotated sorted arrays and graph traversal algorithms (BFS queue, DFS recursion) with cycle detection.',
    doneWhen: 'Graph and binary search templates verified and pushed to GitHub.'
  },
  {
    day: 6,
    phaseId: 1,
    topics: ['Linux & CLI Power Tools for Engineers'],
    isBuildDay: false,
    timeSplit: '2h CLI Commands / 2.5h Bash Scripting / 1h Shell Tuning',
    practiceTask: 'Master bash pipes, awk, sed, grep, curl, jq, process inspection (ps, htop, kill), and write an automated log analysis script.',
    doneWhen: 'Bash script parsing server access logs and outputting JSON summary statistics.'
  },
  {
    day: 7,
    phaseId: 1,
    topics: ['Git, GitHub Workflows & Weekly Revision Session'],
    isBuildDay: false,
    timeSplit: '2h Git Internals / 2h Practice / 1.5h Week 1 Revision',
    practiceTask: 'Practice interactive rebase, squashing, merge conflict resolution, pre-commit hooks, and review Days 1-6 DSA problems.',
    doneWhen: 'Clean git repository created with multi-branch PR workflow and passing pre-commit hooks.'
  },
  {
    day: 8,
    phaseId: 1,
    topics: ['Relational Databases & SQL Mastery'],
    isBuildDay: false,
    timeSplit: '2h SQL Theory / 2.5h Querying / 1h Optimization',
    practiceTask: 'Write complex SQL queries (multi-table JOINs, GROUP BY, Window Functions, CTEs) and explain indexing (B-Tree) & EXPLAIN ANALYZE.',
    doneWhen: 'PostgreSQL schema created with foreign keys, indexes, and optimized analytical queries.'
  },
  {
    day: 9,
    phaseId: 1,
    topics: ['APIs & REST Architecture Design'],
    isBuildDay: false,
    timeSplit: '2h Architecture / 2.5h Endpoint Design / 1h Specs',
    practiceTask: 'Design a RESTful API specification with proper HTTP verbs, status codes, query pagination, and OpenAPI/Swagger 3.0 documentation.',
    doneWhen: 'OpenAPI specification YAML written and validated with comprehensive error responses.'
  },
  {
    day: 10,
    phaseId: 1,
    topics: ['Testing & Debugging in Python'],
    isBuildDay: false,
    timeSplit: '2h Pytest Framework / 2.5h Test Suite / 1h Profiling',
    practiceTask: 'Write unit tests using pytest with fixtures, parameterization, mock API calls using unittest.mock, and profile code with cProfile.',
    doneWhen: 'Test suite with >85% code coverage and zero failing tests on core modules.'
  },
  {
    day: 11,
    phaseId: 1,
    topics: ['Build Project 1: Production-Ready Python API — Core Architecture'],
    isBuildDay: true,
    timeSplit: '1h Planning / 3.5h Implementation / 1h Review',
    practiceTask: 'Scaffold project structure, configure SQL database connection (SQLAlchemy 2.0 / asyncpg), and build domain CRUD models.',
    doneWhen: 'Modular service layer and database migrations running cleanly.'
  },
  {
    day: 12,
    phaseId: 1,
    topics: ['Build Project 1: Production-Ready Python API — Validation & Error Handling'],
    isBuildDay: true,
    timeSplit: '1h Design / 3.5h Coding / 1h Testing',
    practiceTask: 'Add request validation, custom exception handlers, JWT authentication, and automated integration tests.',
    doneWhen: 'All API routes secured and verified with pytest integration tests.'
  },
  {
    day: 13,
    phaseId: 1,
    topics: ['Build Project 2: AI-Powered Backend with FastAPI — Async Endpoints'],
    isBuildDay: true,
    timeSplit: '1h Async Architecture / 3.5h FastAPI Coding / 1h Benchmarks',
    practiceTask: 'Build asynchronous FastAPI service handling non-blocking I/O, background tasks, and dependency injection patterns.',
    doneWhen: 'FastAPI app running with async route handlers and automated docs at /docs.'
  },
  {
    day: 14,
    phaseId: 1,
    topics: ['Build Project 2: AI-Powered Backend with FastAPI — Streaming & Middleware'],
    isBuildDay: true,
    timeSplit: '1h SSE/Streaming / 3.5h Implementation / 1h Testing',
    practiceTask: 'Implement Server-Sent Events (SSE) streaming endpoint, CORS middleware, rate-limiting, and structured logging.',
    doneWhen: 'Streaming endpoint verified with curl -N and structured request-ID logs emitted.'
  },
  {
    day: 15,
    phaseId: 1,
    topics: ['Phase 1 Capstone: Dockerizing Python API & Software Engineering Review'],
    isBuildDay: true,
    timeSplit: '2h Docker Container / 2h Full E2E Audit / 1.5h Phase Review',
    practiceTask: 'Create production multi-stage Dockerfile, run docker-compose with Postgres, and write a complete README and API collection.',
    doneWhen: 'Containers running via single docker-compose up with passing healthchecks.'
  },

  // --- PHASE 2: Days 16-30 (ML + Deep Learning Concepts) ---
  {
    day: 16,
    phaseId: 2,
    topics: ['Linear Algebra for AI & Machine Learning'],
    isBuildDay: false,
    timeSplit: '2h Linear Algebra / 2.5h NumPy Operations / 1h Geometric Intuition',
    practiceTask: 'Implement matrix multiplications, dot products, vector projections, and SVD decomposition using NumPy from scratch.',
    doneWhen: 'NumPy notebook demonstrating matrix transformations and dimensionality reduction.'
  },
  {
    day: 17,
    phaseId: 2,
    topics: ['Probability & Statistics for Machine Learning'],
    isBuildDay: false,
    timeSplit: '2h Probability Theory / 2.5h Statistical Coding / 1h Analysis',
    practiceTask: 'Calculate conditional probabilities, Bayes theorem, expected values, variance, and normal/multinomial distributions in code.',
    doneWhen: 'Statistical intuition verified with Python simulations of Bayesian inference.'
  },
  {
    day: 18,
    phaseId: 2,
    topics: ['Machine Learning Fundamentals: Loss Functions & Optimization'],
    isBuildDay: false,
    timeSplit: '2h Supervised Learning / 2.5h Gradient Descent / 1h Math Proofs',
    practiceTask: 'Derive and code MSE and Binary Cross-Entropy loss functions; write batch and stochastic gradient descent from scratch.',
    doneWhen: 'From-scratch linear and logistic regression models converging to optimal weights.'
  },
  {
    day: 19,
    phaseId: 2,
    topics: ['Classical ML Models & Scikit-Learn Pipelines'],
    isBuildDay: false,
    timeSplit: '1.5h Algorithms / 3h Scikit-Learn / 1h Leak-Free Design',
    practiceTask: 'Build Scikit-Learn ColumnTransformer pipelines with standard scaling, one-hot encoding, and train Random Forest / XGBoost classifiers.',
    doneWhen: 'Leakage-safe end-to-end preprocessing pipeline trained and serialized.'
  },
  {
    day: 20,
    phaseId: 2,
    topics: ['Model Evaluation & Validation Strategy'],
    isBuildDay: false,
    timeSplit: '2h Metrics Theory / 2.5h Implementation / 1h Error Analysis',
    practiceTask: 'Calculate Confusion Matrix, Precision, Recall, F1-Score, ROC-AUC, and implement stratified K-Fold cross-validation.',
    doneWhen: 'Model evaluation report detailing metric tradeoffs across imbalanced data.'
  },
  {
    day: 21,
    phaseId: 2,
    topics: ['Neural Networks: Perceptrons, Activations & Backpropagation'],
    isBuildDay: false,
    timeSplit: '2h NN Foundations / 2.5h Manual Backprop / 1h Visuals',
    practiceTask: 'Implement a 2-layer Multi-Layer Perceptron (MLP) with ReLU and Sigmoid activations, deriving manual backward pass gradients.',
    doneWhen: 'Toy neural network learning XOR problem purely with manual backpropagation.'
  },
  {
    day: 22,
    phaseId: 2,
    topics: ['Deep Learning with PyTorch: Tensors & Autograd'],
    isBuildDay: false,
    timeSplit: '2h PyTorch Mechanics / 2.5h Module Design / 1h GPU Checks',
    practiceTask: 'Build nn.Module classes, custom Dataset and DataLoader, forward pass, loss computation, and loss.backward() in PyTorch.',
    doneWhen: 'PyTorch neural network training loop running with DataLoader batching.'
  },
  {
    day: 23,
    phaseId: 2,
    topics: ['Training vs Inference Mechanics: Epochs, Optimizers & Learning Rates'],
    isBuildDay: false,
    timeSplit: '2h Training Dynamics / 2.5h Experimentation / 1h Profiling',
    practiceTask: 'Compare Adam vs SGD with Momentum, implement Learning Rate Schedulers, early stopping, and torch.no_grad() inference mode.',
    doneWhen: 'Training curves showing loss convergence with early stopping checkpointing.'
  },
  {
    day: 24,
    phaseId: 2,
    topics: ['Embeddings Theory & High-Dimensional Geometry'],
    isBuildDay: false,
    timeSplit: '2h Vector Geometry / 2.5h Word Embeddings / 1h Similarity Math',
    practiceTask: 'Implement cosine similarity, dot product, and Euclidean distance in vector space; inspect Word2Vec word analogies.',
    doneWhen: 'Vector similarity functions written with geometric visualization of cosine distance.'
  },
  {
    day: 25,
    phaseId: 2,
    topics: ['Transformers Architecture I: Self-Attention & Multi-Head Attention'],
    isBuildDay: false,
    timeSplit: '2.5h Attention Math / 2h PyTorch Attention / 1h Architecture Review',
    practiceTask: 'Code Scaled Dot-Product Attention from scratch in PyTorch (Q, K, V matrices, softmax scaling, causal masking).',
    doneWhen: 'Custom MultiHeadAttention module computing self-attention weights cleanly.'
  },
  {
    day: 26,
    phaseId: 2,
    topics: ['Build Project 1: Train and Deploy an ML Model — Training & Tuning'],
    isBuildDay: true,
    timeSplit: '1h EDA & Data / 3.5h Training & Tuning / 1h Metrics Audit',
    practiceTask: 'Train a production tabular classifier with hyperparameter search (Optuna), cross-validation, and export with joblib/ONNX.',
    doneWhen: 'High-performing tuned model exported with logged validation metrics.'
  },
  {
    day: 27,
    phaseId: 2,
    topics: ['Build Project 1: Train and Deploy an ML Model — FastAPI Inference Microservice'],
    isBuildDay: true,
    timeSplit: '1h Service Architecture / 3.5h Deployment / 1h Load Testing',
    practiceTask: 'Package the trained model into a high-throughput FastAPI inference endpoint with Pydantic request/response schemas.',
    doneWhen: 'Inference microservice responding to prediction payloads in under 20ms.'
  },
  {
    day: 28,
    phaseId: 2,
    topics: ['Transformers Architecture II & Hugging Face Ecosystem'],
    isBuildDay: false,
    timeSplit: '2h HF Transformers / 2.5h Tokenizers & Datasets / 1h Models',
    practiceTask: 'Use Hugging Face AutoTokenizer and AutoModelForSequenceClassification to tokenize datasets and run pre-trained inference.',
    doneWhen: 'Tokenization pipeline handling padding, truncation, and attention masks.'
  },
  {
    day: 29,
    phaseId: 2,
    topics: ['Build Project 2: Fine-Tune a Small Transformer Model (LoRA / PEFT)'],
    isBuildDay: true,
    timeSplit: '1h PEFT/LoRA Setup / 3.5h Fine-Tuning Run / 1h Evaluation',
    practiceTask: 'Fine-tune a small transformer (e.g., DistilBERT or SmolLM) on a classification or text task using LoRA (PEFT) and Hugging Face Trainer.',
    doneWhen: 'LoRA adapter weights trained and saved with evaluated accuracy gain.'
  },
  {
    day: 30,
    phaseId: 2,
    topics: ['Phase 2 Capstone: Transformer Model Evaluation & Phase Review'],
    isBuildDay: true,
    timeSplit: '2h Benchmark Tests / 2h Comparison Lab / 1.5h Phase Review',
    practiceTask: 'Evaluate fine-tuned model against base model zero-shot performance, measure latency, and document takeaways.',
    doneWhen: 'Evaluation benchmark table showing base vs fine-tuned accuracy and latency.'
  },

  // --- PHASE 3: Days 31-45 (LLM Engineering) ---
  {
    day: 31,
    phaseId: 3,
    topics: ['LLM APIs & Modern Model Paradigms'],
    isBuildDay: false,
    timeSplit: '2h API Architecture / 2.5h SDK Coding / 1h Token Economics',
    practiceTask: 'Build multi-provider API client (OpenAI, Anthropic Claude, Google Gemini) handling retries, streaming, and token counters.',
    doneWhen: 'Unified LLM client switching providers via configuration with streaming support.'
  },
  {
    day: 32,
    phaseId: 3,
    topics: ['Prompt Engineering & In-Context Reasoning'],
    isBuildDay: false,
    timeSplit: '2h Prompt Theory / 2.5h Prompt Experimentation / 1h Edge Testing',
    practiceTask: 'Implement Few-Shot prompting, Chain-of-Thought (CoT), System instructions, and XML/Markdown delimiter structuring.',
    doneWhen: 'Prompt catalog with automated test cases demonstrating higher reasoning accuracy.'
  },
  {
    day: 33,
    phaseId: 3,
    topics: ['Structured Outputs & JSON Schema Validation'],
    isBuildDay: false,
    timeSplit: '2h JSON Schema / 2.5h Pydantic & Instructor / 1h Validation Rules',
    practiceTask: 'Force LLM outputs into strict Pydantic models using OpenAI Structured Outputs and Instructor library with automatic re-prompt on error.',
    doneWhen: 'Complex nested data extracted from unstructured text with 100% schema compliance.'
  },
  {
    day: 34,
    phaseId: 3,
    topics: ['Function Calling Basics: Tool Declarations & Execution Loops'],
    isBuildDay: false,
    timeSplit: '2h Function Specs / 2.5h Dispatch Engine / 1h Error Traps',
    practiceTask: 'Define tool JSON schemas, capture LLM tool call arguments, execute local Python functions, and return results back to LLM context.',
    doneWhen: 'Two-way function calling loop executing calculator and weather lookup tools.'
  },
  {
    day: 35,
    phaseId: 3,
    topics: ['Embeddings in Practice: Dense Representations & Model Selection'],
    isBuildDay: false,
    timeSplit: '2h Embedding Models / 2.5h Vector Math / 1h Dimension Tradeoffs',
    practiceTask: 'Generate embeddings using text-embedding-3-small and BAAI/bge models, test cosine similarity on semantic duplicates vs opposites.',
    doneWhen: 'Benchmarked embedding script computing top-k semantic matches over 1,000 documents.'
  },
  {
    day: 36,
    phaseId: 3,
    topics: ['Vector Databases & Indexing Strategies (Chroma / Qdrant)'],
    isBuildDay: false,
    timeSplit: '2h Vector DB Internals / 2.5h Collections & Metadata / 1h Filtering',
    practiceTask: 'Initialize ChromaDB / Qdrant, configure collections with HNSW indexing, and perform filtered metadata vector queries.',
    doneWhen: 'Vector store queried with combined semantic search and metadata boolean filters.'
  },
  {
    day: 37,
    phaseId: 3,
    topics: ['RAG Architecture & Chunking Strategies'],
    isBuildDay: false,
    timeSplit: '2h Chunking Algorithms / 2.5h Ingestion Pipeline / 1h Chunk Quality',
    practiceTask: 'Implement Character, Recursive, and Semantic chunking with chunk overlap and metadata tagging (source, page, timestamp).',
    doneWhen: 'Document ingestion pipeline chunking PDFs/Markdown without cutting sentences mid-thought.'
  },
  {
    day: 38,
    phaseId: 3,
    topics: ['Hybrid Search: Dense Vector + Sparse Keyword (BM25)'],
    isBuildDay: false,
    timeSplit: '2h Hybrid Search / 2.5h RRF Algorithm / 1h Search Evaluation',
    practiceTask: 'Combine BM25 keyword search with dense embedding search using Reciprocal Rank Fusion (RRF) to merge ranked lists.',
    doneWhen: 'Hybrid retriever outperforming pure vector search on domain-specific terminology queries.'
  },
  {
    day: 39,
    phaseId: 3,
    topics: ['Reranking & Context Management'],
    isBuildDay: false,
    timeSplit: '2h Rerankers / 2.5h Context Compression / 1h Lost-in-the-Middle',
    practiceTask: 'Integrate Cohere Rerank / Cross-Encoder to rerank top-25 chunks down to top-5; implement context compression and window pruning.',
    doneWhen: 'Reranker pipeline showing significant precision improvement in top-3 context chunks.'
  },
  {
    day: 40,
    phaseId: 3,
    topics: ['RAG Failure Modes & Weekly Synthesis'],
    isBuildDay: false,
    timeSplit: '2h Failure Taxonomy / 2h Guard Prompts / 1.5h Week 3 Review',
    practiceTask: 'Address empty retrieval, out-of-domain queries with strict abstention ("I don\'t have enough information"), and citation prompts.',
    doneWhen: 'RAG pipeline returning inline bracketed citations and abstaining on unanswerable questions.'
  },
  {
    day: 41,
    phaseId: 3,
    topics: ['Build Project 1: Production-Grade RAG Application — Ingestion & Storage'],
    isBuildDay: true,
    timeSplit: '1h System Design / 3.5h Ingestion Service / 1h Pipeline Test',
    practiceTask: 'Build multi-format document parser (PDF, Markdown, HTML), metadata enrichment, chunking, and automated vector indexing.',
    doneWhen: 'Automated ingestion pipeline processing document batches with progress logs.'
  },
  {
    day: 42,
    phaseId: 3,
    topics: ['Build Project 1: Production-Grade RAG Application — Hybrid Retrieval & Synthesis'],
    isBuildDay: true,
    timeSplit: '1h Retrieval Design / 3.5h Query Engine / 1h Streaming UI',
    practiceTask: 'Wire hybrid search, cross-encoder reranker, prompt synthesizer with grounded citations, and streaming FastAPI response.',
    doneWhen: 'End-to-end RAG API delivering streaming cited answers from ingested documentation.'
  },
  {
    day: 43,
    phaseId: 3,
    topics: ['Build Project 2: Multi-Document Research Assistant — Query Routing'],
    isBuildDay: true,
    timeSplit: '1h Architecture / 3.5h Router Implementation / 1h Multi-Doc Tests',
    practiceTask: 'Build an LLM query router directing questions across disparate document collections (finance, tech docs, policies).',
    doneWhen: 'Router accurately classifying query intent and selecting target document indexes.'
  },
  {
    day: 44,
    phaseId: 3,
    topics: ['Build Project 2: Multi-Document Research Assistant — Synthesis & Attribution'],
    isBuildDay: true,
    timeSplit: '1h Multi-Doc Synthesis / 3.5h Synthesis Engine / 1h Verification',
    practiceTask: 'Implement comparative synthesis across multiple conflicting documents, generating comparative summary tables and footnotes.',
    doneWhen: 'Research assistant generating multi-source synthesis reports with direct quotes.'
  },
  {
    day: 45,
    phaseId: 3,
    topics: ['Phase 3 Capstone: RAG Benchmarking & Engineering Review'],
    isBuildDay: true,
    timeSplit: '2h RAG Evaluation Run / 2h Refactor & Polish / 1.5h Phase Review',
    practiceTask: 'Run benchmark evaluation on 20 test questions assessing retrieval recall, citation validity, and response latency.',
    doneWhen: 'RAG system benchmark report showing >90% precision at k=3 with full source fidelity.'
  },

  // --- PHASE 4: Days 46-60 (Agentic AI) ---
  {
    day: 46,
    phaseId: 4,
    topics: ['AI Agents Foundations: The Autonomous Loop'],
    isBuildDay: false,
    timeSplit: '2h Agent Architecture / 2.5h Loop Implementation / 1h Telemetry',
    practiceTask: 'Construct the core agent loop: Perception -> Reasoning -> Action -> Observation -> Termination condition.',
    doneWhen: 'Python agent loop running autonomously with max-iteration guardrail.'
  },
  {
    day: 47,
    phaseId: 4,
    topics: ['Tool Use & Dynamic Dispatch Inside Agents'],
    isBuildDay: false,
    timeSplit: '2h Tooling Systems / 2.5h Tool Registry / 1h Exception Handlers',
    practiceTask: 'Build a typed ToolRegistry decorator pattern, automatic JSON schema generation from docstrings, and robust error recovery.',
    doneWhen: 'Agent dynamically selecting and executing multiple tools while handling execution exceptions gracefully.'
  },
  {
    day: 48,
    phaseId: 4,
    topics: ['The ReAct Framework: Reasoning & Acting in Harmony'],
    isBuildDay: false,
    timeSplit: '2h ReAct Mechanics / 2.5h ReAct Agent / 1h Tracing Observations',
    practiceTask: 'Implement the ReAct prompt and parser from scratch: Thought -> Action -> Action Input -> Observation cycle.',
    doneWhen: 'ReAct agent solving multi-step question by querying tools and reasoning through intermediate observations.'
  },
  {
    day: 49,
    phaseId: 4,
    topics: ['Agent Workflows & State Machines (LangGraph / StateGraph)'],
    isBuildDay: false,
    timeSplit: '2h Graph Architecture / 2.5h State Graph Coding / 1h Branching',
    practiceTask: 'Define typed agent state objects, conditional routing edges, and cyclical execution graphs with branching decisions.',
    doneWhen: 'Deterministic state graph executing conditional branches based on previous node outputs.'
  },
  {
    day: 50,
    phaseId: 4,
    topics: ['Planning, Task Decomposition & Self-Critique'],
    isBuildDay: false,
    timeSplit: '2h Planning Patterns / 2.5h Plan-and-Execute Agent / 1h Reflexion',
    practiceTask: 'Build Plan-and-Solve agent that first outputs an execution DAG, verifies each sub-task, and self-corrects on failures (Reflexion).',
    doneWhen: 'Agent breaking down complex research goals into sequential sub-tasks with self-correction.'
  },
  {
    day: 51,
    phaseId: 4,
    topics: ['Agent Memory Systems: Short-Term, Long-Term & Episodic'],
    isBuildDay: false,
    timeSplit: '2h Memory Architectures / 2.5h Vector & Buffer Memory / 1h Persistence',
    practiceTask: 'Implement sliding window conversation buffer, summary memory, and vector-backed episodic memory for long-term recall.',
    doneWhen: 'Agent maintaining context across multi-session dialogues using SQLite + vector storage.'
  },
  {
    day: 52,
    phaseId: 4,
    topics: ['Model Context Protocol (MCP): Client & Server Architecture'],
    isBuildDay: false,
    timeSplit: '2.5h MCP Protocol Spec / 2h MCP Server Coding / 1h Client Testing',
    practiceTask: 'Build an MCP server exposing local tools/resources over JSON-RPC stdio and connect it to an MCP client agent.',
    doneWhen: 'Working MCP server communicating tool capabilities to LLM agent via protocol standards.'
  },
  {
    day: 53,
    phaseId: 4,
    topics: ['Human-in-the-Loop (HITL) & Safety Guardrails for Agents'],
    isBuildDay: false,
    timeSplit: '2h HITL Patterns / 2.5h Interrupt & Resume / 1h Security Policies',
    practiceTask: 'Implement confirmation gates for irreversible tool actions (file write, email send, API post) with suspend/resume state.',
    doneWhen: 'Agent halting before destructive actions, waiting for human approval token before proceeding.'
  },
  {
    day: 54,
    phaseId: 4,
    topics: ['Multi-Agent Systems I: Supervisor & Worker Swarms'],
    isBuildDay: false,
    timeSplit: '2h Multi-Agent Theory / 2.5h Supervisor Architecture / 1h Inter-Agent Messaging',
    practiceTask: 'Implement hierarchical multi-agent system with a Supervisor LLM delegating tasks to specialized Worker agents.',
    doneWhen: 'Supervisor agent successfully breaking problem and aggregating deliverables from 2 worker agents.'
  },
  {
    day: 55,
    phaseId: 4,
    topics: ['Multi-Agent Systems II & Weekly Agentic Synthesis'],
    isBuildDay: false,
    timeSplit: '2h Collaborative Patterns / 2h Consensus Protocols / 1.5h Week 4 Review',
    practiceTask: 'Build collaborative agent debate/consensus pattern where Researcher and Critic agents refine final outputs together.',
    doneWhen: 'Two-agent consensus dialogue producing verified, peer-reviewed analysis.'
  },
  {
    day: 56,
    phaseId: 4,
    topics: ['Build Project 1: Autonomous Research Agent — Web Scraping & Tool Suite'],
    isBuildDay: true,
    timeSplit: '1h Tool Suite Setup / 3.5h Agent Scraper Engine / 1h Testing',
    practiceTask: 'Build research agent equipped with DuckDuckGo/Tavily search tools, web content extraction, and document synthesis.',
    doneWhen: 'Research agent fetching web URLs, parsing content, and answering factual queries autonomously.'
  },
  {
    day: 57,
    phaseId: 4,
    topics: ['Build Project 1: Autonomous Research Agent — Markdown Report Generator'],
    isBuildDay: true,
    timeSplit: '1h Report Design / 3.5h Synthesis & Formatting / 1h Validation',
    practiceTask: 'Add recursive deep-dive searching, fact cross-checking, and generate comprehensive formatted Markdown reports with citations.',
    doneWhen: 'Agent outputting a multi-page deep-dive research report on any technical topic.'
  },
  {
    day: 58,
    phaseId: 4,
    topics: ['Build Project 2: Autonomous Coding Agent — Sandbox & Execution'],
    isBuildDay: true,
    timeSplit: '1h Sandbox Design / 3.5h Coding Loop / 1h Self-Correction',
    practiceTask: 'Build a coding agent that writes Python scripts, executes them in a local subprocess sandbox, reads stderr, and self-fixes bugs.',
    doneWhen: 'Coding agent autonomously resolving syntax and runtime errors through iteration.'
  },
  {
    day: 59,
    phaseId: 4,
    topics: ['Build Project 3: Production Multi-Agent Collaborative Workflow'],
    isBuildDay: true,
    timeSplit: '1h Architecture / 3.5h Multi-Agent Orchestration / 1h E2E Test',
    practiceTask: 'Assemble end-to-end multi-agent pipeline: Product Manager creates specs -> Coder builds code -> Reviewer validates tests.',
    doneWhen: 'Full 3-agent pipeline turning prompt specification into verified, runnable code.'
  },
  {
    day: 60,
    phaseId: 4,
    topics: ['Phase 4 Capstone: Agent Stress-Testing, Telemetry & Hardening'],
    isBuildDay: true,
    timeSplit: '2h Stress Testing / 2h Telemetry Tracing / 1.5h Phase Review',
    practiceTask: 'Test agents against infinite loops, ambiguous prompts, and tool timeouts; log full execution traces with step timestamps.',
    doneWhen: 'Agent architecture hardened with circuit breakers and full execution trace logs.'
  },

  // --- PHASE 5: Days 61-75 (Evaluation + Production AI) ---
  {
    day: 61,
    phaseId: 5,
    topics: ['LLM Evaluation Foundations: The Measurement Imperative'],
    isBuildDay: false,
    timeSplit: '2h Eval Theory / 2.5h Deterministic Testing / 1h Test Datasets',
    practiceTask: 'Build deterministic evaluation test harnesses: Exact Match, Regex assertions, JSON validity, BLEU, and ROUGE-L scores.',
    doneWhen: 'Automated test suite asserting deterministic quality criteria across 50 sample LLM outputs.'
  },
  {
    day: 62,
    phaseId: 5,
    topics: ['Automated Evals: The RAG Triad & Metric Suites'],
    isBuildDay: false,
    timeSplit: '2h RAG Triad / 2.5h Ragas / DeepEval Implementation / 1h Analysis',
    practiceTask: 'Implement the RAG Triad: Context Relevance, Groundedness (Faithfulness), and Answer Relevance using automated scoring.',
    doneWhen: 'RAG evaluation script returning quantitative 0.0-1.0 scores for each triad pillar.'
  },
  {
    day: 63,
    phaseId: 5,
    topics: ['LLM-as-a-Judge: Rubrics, Calibration & Bias Mitigation'],
    isBuildDay: false,
    timeSplit: '2h Judge Rubrics / 2.5h Judge Implementation / 1h Bias Correction',
    practiceTask: 'Design structured evaluation prompts with 1-5 scoring rubrics, pairwise comparison, and position-bias mitigation (swapping order).',
    doneWhen: 'Calibrated LLM judge evaluating reasoning quality with high correlation to human labels.'
  },
  {
    day: 64,
    phaseId: 5,
    topics: ['Failure Analysis & Error Taxonomy in AI Systems'],
    isBuildDay: false,
    timeSplit: '2h Failure Categorization / 2.5h Error Triage / 1h Root-Cause Analysis',
    practiceTask: 'Build an automated failure taxonomy categorizer: Retrieval miss, Stale data, Hallucination, Formatting error, Safety block.',
    doneWhen: 'Classification script sorting failing benchmark runs into root-cause buckets.'
  },
  {
    day: 65,
    phaseId: 5,
    topics: ['Hallucination Testing & Adversarial Red-Teaming'],
    isBuildDay: false,
    timeSplit: '2h Red-Teaming Theory / 2.5h Attack Datasets / 1h Defenses',
    practiceTask: 'Curate 30 adversarial prompts (prompt injection, jailbreak attempts, ungrounded trap questions) and measure defense rate.',
    doneWhen: 'Adversarial benchmark report quantifying system refusal and safety compliance.'
  },
  {
    day: 66,
    phaseId: 5,
    topics: ['Guardrails & Semantic Output Moderation'],
    isBuildDay: false,
    timeSplit: '2h Guardrail Architectures / 2.5h Guardrail Implementation / 1h Benchmarks',
    practiceTask: 'Integrate semantic guardrails (NeMo Guardrails or Llama-Guard) to validate input prompts and filter toxic/off-topic outputs.',
    doneWhen: 'Input/output guardrail intercepting policy-violating prompts before LLM inference.'
  },
  {
    day: 67,
    phaseId: 5,
    topics: ['AI Observability & Distributed Tracing (OpenTelemetry / Langfuse)'],
    isBuildDay: false,
    timeSplit: '2h Tracing Theory / 2.5h Instrumentation / 1h Dashboard Review',
    practiceTask: 'Instrument LLM calls with OpenTelemetry / Langfuse traces capturing prompt tokens, completion tokens, latency, and cost per span.',
    doneWhen: 'Every application LLM query producing nested distributed trace tree with timing and cost.'
  },
  {
    day: 68,
    phaseId: 5,
    topics: ['Latency Optimization: Streaming, TTFT & Prompt Pruning'],
    isBuildDay: false,
    timeSplit: '2h Latency Profiling / 2.5h Optimization Techniques / 1h Benchmarks',
    practiceTask: 'Measure Time-to-First-Token (TTFT) and Tokens-Per-Second; implement prompt pruning, stop tokens, and streaming chunk buffers.',
    doneWhen: 'Benchmarked reduction in TTFT from 1.8s down to <600ms on interactive queries.'
  },
  {
    day: 69,
    phaseId: 5,
    topics: ['Cost Optimization: Model Cascades & Semantic Caching'],
    isBuildDay: false,
    timeSplit: '2h Cost Engineering / 2.5h Routing & Caching / 1h ROI Analysis',
    practiceTask: 'Implement model cascade (route simple queries to fast/cheap model, complex to frontier model) + Redis semantic query cache.',
    doneWhen: 'Semantic cache serving identical/similar queries with 0 LLM cost and <10ms response.'
  },
  {
    day: 70,
    phaseId: 5,
    topics: ['Reliability, Retries & Fallback Strategies + Weekly Revision'],
    isBuildDay: false,
    timeSplit: '2h Resilience Patterns / 2h Circuit Breaker / 1.5h Week 5 Review',
    practiceTask: 'Implement exponential backoff with jitter, fallback secondary model providers on 429/500 errors, and circuit breakers.',
    doneWhen: 'Resilience layer seamlessly failing over to secondary provider upon primary provider outage.'
  },
  {
    day: 71,
    phaseId: 5,
    topics: ['Build Project 1: Automated Evaluation Framework — Test Runner'],
    isBuildDay: true,
    timeSplit: '1h Architecture / 3.5h Framework Coding / 1h CLI Runner',
    practiceTask: 'Build custom pytest-eval framework that runs test batches against prompt versions, computes metrics, and outputs summary tables.',
    doneWhen: 'CLI command pytest -m eval producing tabular evaluation scorecard across models.'
  },
  {
    day: 72,
    phaseId: 5,
    topics: ['Build Project 1: Automated Evaluation Framework — Regression Alerts & Reports'],
    isBuildDay: true,
    timeSplit: '1h CI Integration / 3.5h Diffing & Alerts / 1h Documentation',
    practiceTask: 'Add regression detection: fail CI/CD build if answer groundedness drops below 0.85 or latency increases by >20%.',
    doneWhen: 'Automated regression test passing/failing against baseline gold standard dataset.'
  },
  {
    day: 73,
    phaseId: 5,
    topics: ['Build Project 2: AI Observability Dashboard — Telemetry Ingestion'],
    isBuildDay: true,
    timeSplit: '1h Dashboard Design / 3.5h Ingestion Service / 1h Data Models',
    practiceTask: 'Create telemetry storage service aggregating session traces, latency percentiles (p50, p95), and token counts.',
    doneWhen: 'Telemetry service logging and querying structured LLM execution spans.'
  },
  {
    day: 74,
    phaseId: 5,
    topics: ['Build Project 2: AI Observability Dashboard — Visual Analytics & Feedback'],
    isBuildDay: true,
    timeSplit: '1h UI Components / 3.5h Dashboard Integration / 1h User Ratings',
    practiceTask: 'Build responsive analytics UI displaying request volume, token spend, error rates, and user thumbs-up/down ratings.',
    doneWhen: 'Interactive analytics dashboard displaying real-time metrics and drill-down traces.'
  },
  {
    day: 75,
    phaseId: 5,
    topics: ['Phase 5 Capstone: End-to-End Production AI Reliability Audit'],
    isBuildDay: true,
    timeSplit: '2h System Audit / 2h Red-Team Verification / 1.5h Phase Review',
    practiceTask: 'Run complete audit combining Evals, Observability, and Guardrails across the entire application stack.',
    doneWhen: 'Production AI Readiness Scorecard signed off with zero unhandled critical failure modes.'
  },

  // --- PHASE 6: Days 76-90 (Deployment + Systems) ---
  {
    day: 76,
    phaseId: 6,
    topics: ['Docker & Production Containerization for AI'],
    isBuildDay: false,
    timeSplit: '2h Container Design / 2.5h Multi-Stage Dockerfile / 1h Image Optimization',
    practiceTask: 'Write optimized multi-stage Dockerfile for FastAPI + PyTorch/LLM application; minimize image size using distroless/slim bases.',
    doneWhen: 'Docker image built and verified under 450MB with non-root security user.'
  },
  {
    day: 77,
    phaseId: 6,
    topics: ['Model Serving Engines: vLLM, Ollama & Triton'],
    isBuildDay: false,
    timeSplit: '2h Serving Architecture / 2.5h vLLM / Ollama Setup / 1h PagedAttention',
    practiceTask: 'Deploy local model serving engine using vLLM / Ollama; study PagedAttention, continuous batching, and KV cache sizing.',
    doneWhen: 'Local model serving OpenAI-compatible API endpoints with continuous batching.'
  },
  {
    day: 78,
    phaseId: 6,
    topics: ['Kubernetes Fundamentals for AI I: Pods, Services & Deployments'],
    isBuildDay: false,
    timeSplit: '2h K8s Concepts / 2.5h Manifests Coding / 1h Minikube Cluster',
    practiceTask: 'Set up Minikube / k3s cluster, write Deployment, Service, ConfigMap, and Secret manifests for AI backend services.',
    doneWhen: 'Replicated AI microservices running and load-balanced in Kubernetes cluster.'
  },
  {
    day: 79,
    phaseId: 6,
    topics: ['Kubernetes Fundamentals for AI II: HPA & GPU Scheduling'],
    isBuildDay: false,
    timeSplit: '2h Advanced K8s / 2.5h Autoscaling & Resource Limits / 1h Helm',
    practiceTask: 'Configure Horizontal Pod Autoscaler (HPA) based on CPU/custom metrics, specify resource requests/limits, and package into Helm chart.',
    doneWhen: 'Helm chart deploying scalable application with working HPA autoscaling policies.'
  },
  {
    day: 80,
    phaseId: 6,
    topics: ['Distributed Systems & Message Queues (Celery / Redis / RabbitMQ)'],
    isBuildDay: false,
    timeSplit: '2h Async Architecture / 2.5h Queue Implementation / 1h Worker Scaling',
    practiceTask: 'Build asynchronous background worker architecture with Redis/RabbitMQ to process long-running AI batch embedding and scraping tasks.',
    doneWhen: 'Client receiving instant 202 Accepted status with worker processing task asynchronously in queue.'
  },
  {
    day: 81,
    phaseId: 6,
    topics: ['High-Performance Caching Architectures for GenAI'],
    isBuildDay: false,
    timeSplit: '2h Caching Strategies / 2.5h Redis Cache / 1h Invalidation Logic',
    practiceTask: 'Implement tiered caching: L1 in-memory LRU cache + L2 distributed Redis cache with TTL and smart cache invalidation.',
    doneWhen: 'Tiered caching layer reducing repeated database and embedding latency by >95%.'
  },
  {
    day: 82,
    phaseId: 6,
    topics: ['GPU Inference & Hardware Acceleration (Quantization: AWQ, GGUF, FP8)'],
    isBuildDay: false,
    timeSplit: '2h Hardware & Quantization / 2.5h Quantization Benchmarks / 1h VRAM Math',
    practiceTask: 'Calculate GPU VRAM requirements for model weights + KV cache; benchmark FP16 vs INT4/AWQ quantization for throughput.',
    doneWhen: 'Quantized model running with 60% less VRAM usage while maintaining quality benchmark.'
  },
  {
    day: 83,
    phaseId: 6,
    topics: ['Cloud Platforms & Serverless AI Deployment (Modal / AWS / GCP)'],
    isBuildDay: false,
    timeSplit: '2h Cloud Architecture / 2.5h Serverless GPU Deployment / 1h Cloud IAM',
    practiceTask: 'Deploy serverless GPU inference function using Modal / RunPod / AWS ECS with cold-start optimization and auto-scaling.',
    doneWhen: 'Serverless cloud endpoint handling prediction requests with automatic scale-to-zero.'
  },
  {
    day: 84,
    phaseId: 6,
    topics: ['AI Security & Governance (OWASP Top 10 for LLMs)'],
    isBuildDay: false,
    timeSplit: '2h Security Principles / 2.5h Security Hardening / 1h Policy Audit',
    practiceTask: 'Audit application against OWASP LLM Top 10: Prompt Injection, Insecure Output Handling, Training Data Poisoning, Sensitive Info Disclosure.',
    doneWhen: 'Security audit checklist completed with rate limiting, sanitization, and secrets management verified.'
  },
  {
    day: 85,
    phaseId: 6,
    topics: ['Buffer & Systems Hardening Day 1'],
    isBuildDay: false,
    timeSplit: '2h Weak Spot Remediation / 2.5h Architecture Diagramming / 1h Synthesis',
    practiceTask: 'Review weak topics from Phases 1-6, refine architecture diagrams (C4 model), and optimize Docker build caching.',
    doneWhen: 'Full system architecture diagram documented and build pipeline streamlined.'
  },
  {
    day: 86,
    phaseId: 6,
    topics: ['Build Project 1: Cloud Deployment Architecture & Container Registry Setup'],
    isBuildDay: true,
    timeSplit: '1h Infra Planning / 3.5h Container Registry & Cloud Config / 1h Smoke Test',
    practiceTask: 'Set up cloud production environment, configure GitHub Container Registry (GHCR), and push production-ready multi-arch images.',
    doneWhen: 'Production containers pushed to registry and verified in staging cloud cluster.'
  },
  {
    day: 87,
    phaseId: 6,
    topics: ['Build Project 1: Deploy AI System to Cloud (FastAPI + Workers + Storage)'],
    isBuildDay: true,
    timeSplit: '1h Deployment Design / 3.5h Live Deployment / 1h DNS & TLS',
    practiceTask: 'Deploy full stack application to cloud with HTTPS, custom domain, persistent managed database, and redis cache.',
    doneWhen: 'Live application responding on public HTTPS URL with healthy status endpoint.'
  },
  {
    day: 88,
    phaseId: 6,
    topics: ['Build Project 2: CI/CD Pipeline for AI Systems (GitHub Actions)'],
    isBuildDay: true,
    timeSplit: '1h CI/CD Workflow Design / 3.5h GitHub Actions / 1h Pipeline Run',
    practiceTask: 'Create GitHub Actions CI/CD pipeline: run linter, execute pytest unit tests, run eval regression checks, and auto-deploy to cloud.',
    doneWhen: 'Green GitHub Actions pipeline successfully building and deploying on push to main branch.'
  },
  {
    day: 89,
    phaseId: 6,
    topics: ['Build Project 2: Production Monitoring, Alerting & Healthchecks'],
    isBuildDay: true,
    timeSplit: '1h Observability Setup / 3.5h Metrics & Alerts / 1h Chaos Test',
    practiceTask: 'Configure Prometheus metrics endpoint, uptime monitoring (BetterStack/UptimeRobot), and Slack/Discord error alerts on 5xx bursts.',
    doneWhen: 'Live monitoring dashboard displaying real-time requests, latency, and uptime alerts configured.'
  },
  {
    day: 90,
    phaseId: 6,
    topics: ['Phase 6 Capstone & Buffer Day 2: Full System Live Verification & Portfolio Showcase'],
    isBuildDay: true,
    timeSplit: '2h Portfolio Showcase / 2h Final E2E Audit / 1.5h Course Complete Celebration',
    practiceTask: 'Perform end-to-end user journey test on deployed system, record a 3-minute video walk-through, publish GitHub README with architecture diagrams.',
    doneWhen: 'Complete 90-day AI Engineer portfolio live, documented, and fully operational.'
  }
];

function generateRoadmapDays() {
  const days = [];
  let curDate = new Date(`${START_DATE}T00:00:00Z`);
  let studyDayIndex = 0;

  while (studyDayIndex < 90) {
    const dateStr = curDate.toISOString().split('T')[0];

    if (holidayMap.has(dateStr)) {
      // Holiday row
      const holidayName = holidayMap.get(dateStr);
      // Determine which phase this holiday falls during
      const currentPhase = PHASES.find(p => {
        const nextStudyDay = studyDayIndex + 1;
        return nextStudyDay >= p.startDay && nextStudyDay <= p.endDay;
      }) || PHASES[0];

      days.push({
        day: null,
        date: dateStr,
        phaseId: currentPhase.id,
        phaseName: currentPhase.name,
        topics: [],
        isBuildDay: false,
        englishLink: null,
        hindiLink: null,
        timeSplit: 'Rest & Recharge',
        practiceTask: 'Festival break: Zero required study tasks. Streak is fully protected.',
        doneWhen: 'Rest and enjoy time with family.',
        hours: 0,
        isHoliday: true,
        holidayName: holidayName
      });
    } else {
      // Study day row
      const blueprint = STUDY_DAYS_BLUEPRINT[studyDayIndex];
      const phase = PHASES.find(p => p.id === blueprint.phaseId) || PHASES[0];

      days.push({
        day: blueprint.day,
        date: dateStr,
        phaseId: phase.id,
        phaseName: phase.name,
        topics: blueprint.topics,
        isBuildDay: blueprint.isBuildDay,
        englishLink: null,
        hindiLink: null,
        timeSplit: blueprint.timeSplit,
        practiceTask: blueprint.practiceTask,
        doneWhen: blueprint.doneWhen,
        hours: 5.5,
        isHoliday: false,
        holidayName: undefined
      });
      studyDayIndex++;
    }

    curDate.setUTCDate(curDate.getUTCDate() + 1);
  }

  return days;
}

const allDays = generateRoadmapDays();

const outputContent = `// Single source of truth for Kavya StudyOS 90-Day AI Engineer Roadmap
// Auto-generated by generateRoadmap.js — Do not hand-type dates or days.

export interface Phase {
  id: number;
  name: string;
  startDay: number;
  endDay: number;
  learn: string[];
  build: string[];
  outcome: string;
}

export interface RoadmapDay {
  day: number | null;
  date: string;
  phaseId: number;
  phaseName: string;
  topics: string[];
  isBuildDay: boolean;
  englishLink: string | null;
  hindiLink: string | null;
  timeSplit: string;
  practiceTask: string;
  doneWhen: string;
  hours: number;
  isHoliday: boolean;
  holidayName?: string;
}

export const ROADMAP_START_DATE = '${START_DATE}';
export const ROADMAP_END_DATE = '${allDays[allDays.length - 1].date}';
export const TOTAL_STUDY_DAYS = 90;
export const TOTAL_HOLIDAYS = ${HOLIDAYS.length};

export const PHASES: Phase[] = ${JSON.stringify(PHASES, null, 2)};

export const DAYS: RoadmapDay[] = ${JSON.stringify(allDays, null, 2)};
`;

const outputPath = path.resolve(process.cwd(), 'src/data/roadmap.ts');
fs.writeFileSync(outputPath, outputContent, 'utf-8');

console.log('✅ Generated src/data/roadmap.ts successfully!');
console.log('Total days in array:', allDays.length);
console.log('Study days:', allDays.filter(d => !d.isHoliday).length);
console.log('Holiday days:', allDays.filter(d => d.isHoliday).length);
console.log('Day 1 date:', allDays.find(d => d.day === 1)?.date);
console.log('Day 90 date:', allDays.find(d => d.day === 90)?.date);
