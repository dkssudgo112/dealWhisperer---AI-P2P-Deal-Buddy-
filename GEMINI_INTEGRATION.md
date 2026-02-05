# Gemini Integration

## English

**DealWhisperer** demonstrates how Gemini 2.0 can power an intelligent P2P marketplace negotiation assistant.

**1. Function Calling (Tool Use)**
The application utilizes Gemini's native function calling feature through the `@google/genai` SDK. Two custom tools are defined: `search_market` for triggering product searches and `start_negotiation` for deploying autonomous negotiation agents. When users interact conversationally (e.g., "Find me an iPhone 14" or "Yes, start negotiating"), Gemini intelligently determines which tool to invoke based on context and intent. In a production environment, these function calls would trigger browser automation (e.g., Puppeteer/Playwright) to access real P2P marketplaces and conduct actual negotiations—currently simulated with mock data for demonstration purposes.

**2. Conversational AI with Context Awareness**
The `gemini-2.0-flash` model processes user inputs with full conversation history and current listing data as context. This enables coherent multi-turn dialogues, understanding of implicit confirmations, and generation of platform-appropriate negotiation messages tailored to each marketplace's communication style.

**3. Future Enhancement: Web-Based Image Retrieval**
The current prototype uses stock images and placeholders. In a full implementation, the system would leverage Gemini's multimodal capabilities combined with web scraping to fetch and analyze actual product images from marketplace listings, enabling visual verification and condition assessment.

These Gemini features transform a simple chat interface into an autonomous deal-hunting agent.

---

## 한글

**DealWhisperer**는 Gemini 2.0이 어떻게 지능형 P2P 마켓플레이스 협상 어시스턴트를 구동할 수 있는지 보여줍니다.

**1. 함수 호출 (Tool Use)**
본 애플리케이션은 `@google/genai` SDK를 통해 Gemini의 네이티브 함수 호출 기능을 활용합니다. 상품 검색을 트리거하는 `search_market`과 자율 협상 에이전트를 배포하는 `start_negotiation` 두 가지 커스텀 도구가 정의되어 있습니다. 사용자가 대화형으로 상호작용할 때(예: "아이폰 14 찾아줘" 또는 "응, 협상 시작해"), Gemini는 문맥과 의도를 기반으로 어떤 도구를 호출할지 지능적으로 판단합니다. 실제 프로덕션 환경에서는 이러한 함수 호출이 브라우저 자동화(예: Puppeteer/Playwright)를 트리거하여 실제 중고거래 플랫폼에 접근하고 실제 협상을 수행하게 됩니다—현재는 데모 목적으로 목업 데이터로 시뮬레이션되어 있습니다.

**2. 문맥 인식 대화형 AI**
`gemini-2.0-flash` 모델은 전체 대화 기록과 현재 매물 데이터를 문맥으로 활용하여 사용자 입력을 처리합니다. 이를 통해 일관된 멀티턴 대화, 암묵적 확인의 이해, 각 마켓플레이스 스타일에 맞춘 협상 메시지 생성이 가능합니다.

**3. 향후 개선: 웹 기반 이미지 수집**
현재 프로토타입은 스톡 이미지와 플레이스홀더를 사용합니다. 완전한 구현에서는 Gemini의 멀티모달 기능과 웹 스크래핑을 결합하여 실제 마켓플레이스 매물에서 상품 이미지를 가져와 분석하고, 시각적 검증 및 상태 평가를 수행할 것입니다.

이러한 Gemini 기능들이 단순한 채팅 인터페이스를 자율 딜 헌팅 에이전트로 변환합니다.
