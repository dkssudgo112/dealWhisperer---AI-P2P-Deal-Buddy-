# DealWhisperer - Project Story

## Inspiration

As a frequent user of **Karrot Market (당근마켓)**, Korea's most popular peer-to-peer marketplace, I found myself constantly switching between multiple platforms—Karrot, Joonggonara (중고나라), and Bungaejangter (번개장터)—just to find the best deal on a single item. Manually comparing prices, checking item conditions, and negotiating with multiple sellers across different apps was exhausting and time-consuming.

I thought: *"What if an AI could do all of this for me?"* That's when the idea for **DealWhisperer** was born—an intelligent agent that searches multiple marketplaces simultaneously, compares listings, and even negotiates on your behalf.

## What I Learned

- **Gemini 2.0 Function Calling**: I learned how to define custom tools and let the AI decide when to invoke them based on natural language input. This made the app feel truly conversational.
- **Multimodal AI Capabilities**: Understanding how Gemini can process both text and images opened up possibilities for future features like visual condition assessment.
- **Rapid Prototyping**: Google AI Studio enabled incredibly fast iteration—from idea to working prototype in a short time.

## How I Built It

I used **Google AI Studio** to build and test the application. The development experience was remarkably smooth and fast. The platform made it easy to:
- Define and test Gemini function calls
- Iterate on prompts and system instructions
- Preview the app in real-time

The tech stack includes React, TypeScript, and Vite for the frontend, with Gemini 2.0 powering the AI agent logic through the `@google/genai` SDK.

## Challenges

The biggest challenge came during **GCP deployment**. Setting up the billing account correctly and resolving deployment errors was frustrating. The error messages were often vague, making debugging difficult. I spent significant time troubleshooting configuration issues that weren't immediately obvious from the documentation.

Despite these hurdles, the project came together successfully, and I'm excited about the potential to expand it with real browser automation and live marketplace integration in the future.

## Technologies Used

| Category | Technology |
|----------|------------|
| **Languages** | TypeScript, JavaScript |
| **Frontend Framework** | React 19 |
| **Build Tool** | Vite 6 |
| **AI/ML API** | Google Gemini 2.0 (`@google/genai` SDK) |
| **Cloud Platform** | Google Cloud Platform (GCP) |
| **Development Platform** | Google AI Studio |
| **UI Icons** | Lucide React |
| **Styling** | Tailwind CSS |

---

## Gemini Integration

**DealWhisperer** demonstrates how Gemini 2.0 can power an intelligent P2P marketplace negotiation assistant.

### 1. Function Calling (Tool Use)

The application utilizes Gemini's native function calling feature through the `@google/genai` SDK. Two custom tools are defined: `search_market` for triggering product searches and `start_negotiation` for deploying autonomous negotiation agents. When users interact conversationally (e.g., "Find me an iPhone 14" or "Yes, start negotiating"), Gemini intelligently determines which tool to invoke based on context and intent. In a production environment, these function calls would trigger browser automation (e.g., Puppeteer/Playwright) to access real P2P marketplaces and conduct actual negotiations—currently simulated with mock data for demonstration purposes.

### 2. Conversational AI with Context Awareness

The `gemini-2.0-flash` model processes user inputs with full conversation history and current listing data as context. This enables coherent multi-turn dialogues, understanding of implicit confirmations, and generation of platform-appropriate negotiation messages tailored to each marketplace's communication style.

### 3. Future Enhancement: Web-Based Image Retrieval

The current prototype uses stock images and placeholders. In a full implementation, the system would leverage Gemini's multimodal capabilities combined with web scraping to fetch and analyze actual product images from marketplace listings, enabling visual verification and condition assessment.

These Gemini features transform a simple chat interface into an autonomous deal-hunting agent.

---

# 한글 버전

## 영감

저는 한국에서 가장 인기 있는 P2P 마켓플레이스인 **당근마켓**을 자주 사용합니다. 그런데 하나의 물건을 찾기 위해 당근마켓, 중고나라, 번개장터 등 여러 플랫폼을 번갈아가며 확인하는 것이 너무 번거로웠습니다. 가격을 비교하고, 물건 상태를 확인하고, 여러 판매자와 동시에 협상하는 것은 지치고 시간이 많이 드는 일이었습니다.

그래서 생각했습니다: *"AI가 이 모든 걸 대신 해줄 수 있다면?"* 그렇게 **DealWhisperer**가 탄생했습니다—여러 마켓플레이스를 동시에 검색하고, 매물을 비교하고, 심지어 대신 협상까지 해주는 지능형 에이전트입니다.

## 배운 점

- **Gemini 2.0 함수 호출**: 커스텀 도구를 정의하고 자연어 입력에 따라 AI가 언제 호출할지 결정하게 하는 방법을 배웠습니다. 이를 통해 앱이 진정한 대화형으로 느껴지게 되었습니다.
- **멀티모달 AI 기능**: Gemini가 텍스트와 이미지를 모두 처리할 수 있다는 것을 이해하면서 시각적 상태 평가 같은 향후 기능에 대한 가능성이 열렸습니다.
- **빠른 프로토타이핑**: Google AI Studio 덕분에 아이디어에서 작동하는 프로토타입까지 매우 빠르게 개발할 수 있었습니다.

## 제작 과정

**Google AI Studio**를 사용하여 애플리케이션을 빌드하고 테스트했습니다. 개발 경험이 놀라울 정도로 매끄럽고 빨랐습니다. 플랫폼을 통해 다음 작업들을 쉽게 할 수 있었습니다:
- Gemini 함수 호출 정의 및 테스트
- 프롬프트와 시스템 지침 반복 개선
- 앱 실시간 미리보기

기술 스택은 프론트엔드에 React, TypeScript, Vite를 사용했고, `@google/genai` SDK를 통해 Gemini 2.0이 AI 에이전트 로직을 구동합니다.

## 어려웠던 점

가장 큰 어려움은 **GCP 배포** 과정에서 발생했습니다. 결제 계정을 올바르게 설정하고 배포 오류를 해결하는 것이 힘들었습니다. 오류 메시지가 종종 모호해서 디버깅이 어려웠습니다. 문서에서 바로 파악하기 어려운 설정 문제를 해결하는 데 상당한 시간을 보냈습니다.

이러한 어려움에도 불구하고 프로젝트를 성공적으로 완성했으며, 향후 실제 브라우저 자동화와 실시간 마켓플레이스 연동으로 확장할 수 있는 가능성에 기대가 큽니다.

## 사용 기술

| 분류 | 기술 |
|------|------|
| **언어** | TypeScript, JavaScript |
| **프론트엔드 프레임워크** | React 19 |
| **빌드 도구** | Vite 6 |
| **AI/ML API** | Google Gemini 2.0 (`@google/genai` SDK) |
| **클라우드 플랫폼** | Google Cloud Platform (GCP) |
| **개발 플랫폼** | Google AI Studio |
| **UI 아이콘** | Lucide React |
| **스타일링** | Tailwind CSS |

---

## Gemini 통합

**DealWhisperer**는 Gemini 2.0이 어떻게 지능형 P2P 마켓플레이스 협상 어시스턴트를 구동할 수 있는지 보여줍니다.

### 1. 함수 호출 (Tool Use)

본 애플리케이션은 `@google/genai` SDK를 통해 Gemini의 네이티브 함수 호출 기능을 활용합니다. 상품 검색을 트리거하는 `search_market`과 자율 협상 에이전트를 배포하는 `start_negotiation` 두 가지 커스텀 도구가 정의되어 있습니다. 사용자가 대화형으로 상호작용할 때(예: "아이폰 14 찾아줘" 또는 "응, 협상 시작해"), Gemini는 문맥과 의도를 기반으로 어떤 도구를 호출할지 지능적으로 판단합니다. 실제 프로덕션 환경에서는 이러한 함수 호출이 브라우저 자동화(예: Puppeteer/Playwright)를 트리거하여 실제 중고거래 플랫폼에 접근하고 실제 협상을 수행하게 됩니다—현재는 데모 목적으로 목업 데이터로 시뮬레이션되어 있습니다.

### 2. 문맥 인식 대화형 AI

`gemini-2.0-flash` 모델은 전체 대화 기록과 현재 매물 데이터를 문맥으로 활용하여 사용자 입력을 처리합니다. 이를 통해 일관된 멀티턴 대화, 암묵적 확인의 이해, 각 마켓플레이스 스타일에 맞춘 협상 메시지 생성이 가능합니다.

### 3. 향후 개선: 웹 기반 이미지 수집

현재 프로토타입은 스톡 이미지와 플레이스홀더를 사용합니다. 완전한 구현에서는 Gemini의 멀티모달 기능과 웹 스크래핑을 결합하여 실제 마켓플레이스 매물에서 상품 이미지를 가져와 분석하고, 시각적 검증 및 상태 평가를 수행할 것입니다.

이러한 Gemini 기능들이 단순한 채팅 인터페이스를 자율 딜 헌팅 에이전트로 변환합니다.
