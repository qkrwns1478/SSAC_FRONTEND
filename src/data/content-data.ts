import type {
  PopularContentResponse,
  NewContent,
  RecommendedContent,
  ContentDetail,
} from '@/types';

export const POPULAR_CONTENT: PopularContentResponse = {
  aggregationLabel: '최근 7일 기준',
  items: [
    { id: 1, title: '주식 투자 초보자를 위한 가이드', viewCount: 12540, likeCount: 873 },
    { id: 2, title: '2024 ETF 투자 전략', viewCount: 9821, likeCount: 654 },
    { id: 3, title: '채권 투자의 이해', viewCount: 7432, likeCount: 521 },
    { id: 4, title: '부동산 투자 트렌드 분석', viewCount: 6987, likeCount: 432 },
    { id: 5, title: '암호화폐 리스크 관리 방법', viewCount: 5643, likeCount: 389 },
    { id: 6, title: '퇴직연금 포트폴리오 구성하기', viewCount: 4892, likeCount: 312 },
  ],
};

export const NEW_CONTENT: NewContent[] = [
  { id: 101, title: '2025년 금리 전망과 투자 전략', registeredAt: '2025-04-24T09:00:00Z' },
  { id: 102, title: '달러 강세 시대의 환율 헤지 방법', registeredAt: '2025-04-23T14:30:00Z' },
  { id: 103, title: '배당주 투자로 안정적인 수익 만들기', registeredAt: '2025-04-22T11:00:00Z' },
  { id: 104, title: '인플레이션 시대의 자산 배분 전략', registeredAt: '2025-04-21T16:00:00Z' },
  { id: 105, title: '해외 주식 직접 투자 가이드', registeredAt: '2025-04-20T10:00:00Z' },
  { id: 106, title: '리츠(REITs) 투자 완전 정복', registeredAt: '2025-04-19T13:00:00Z' },
];

export const TREND_RECOMMENDED: RecommendedContent[] = [
  {
    id: 201,
    title: '지금 주목해야 할 글로벌 ETF TOP 5',
    summary: '최근 시장 트렌드를 반영한 글로벌 ETF 상품을 소개합니다.',
  },
  {
    id: 202,
    title: '초보자도 쉽게 따라하는 적립식 투자',
    summary: '매달 일정 금액을 투자하는 적립식 투자의 장단점을 알아봅니다.',
  },
  {
    id: 203,
    title: '포트폴리오 분산 투자의 기초',
    summary: '리스크를 줄이기 위한 자산 배분의 기본 원칙을 알아봅니다.',
  },
  {
    id: 204,
    title: '2025 글로벌 경제 전망',
    summary: '미국, 유럽, 아시아 경제 동향과 투자 시사점을 분석합니다.',
  },
];

export const PERSONALIZED_RECOMMENDED: RecommendedContent[] = [
  {
    id: 301,
    title: '나의 투자 성향에 맞는 포트폴리오',
    summary: '분석된 투자 성향을 기반으로 맞춤형 포트폴리오를 제안합니다.',
  },
  {
    id: 302,
    title: '최근 조회한 종목 심층 분석',
    summary: '관심 종목에 대한 상세한 분석 리포트를 확인하세요.',
  },
  {
    id: 303,
    title: '나의 퀴즈 오답 복습 자료',
    summary: '틀린 문제와 관련된 심화 학습 자료를 모아드렸습니다.',
  },
];

// 전체 콘텐츠 상세 데이터 (popular + new + recommended 통합)
export const CONTENT_DETAILS: ContentDetail[] = [
  {
    id: 1,
    title: '주식 투자 초보자를 위한 가이드',
    body: '주식 투자를 처음 시작하는 분들을 위해 기본 개념부터 실전 전략까지 단계별로 안내합니다. 주식이란 기업의 소유권 일부를 나타내는 증권으로, 투자자는 주가 상승과 배당금을 통해 수익을 얻을 수 있습니다.',
    category: '주식',
    publishedAt: '2025-04-18T09:00:00Z',
  },
  {
    id: 2,
    title: '2024 ETF 투자 전략',
    body: 'ETF(상장지수펀드)는 다양한 자산을 묶어 하나의 주식처럼 거래할 수 있는 금융 상품입니다. 분산 투자 효과와 낮은 운용 비용이 장점이며, 2024년 주목할 ETF 유형과 투자 전략을 소개합니다.',
    category: 'ETF',
    publishedAt: '2025-04-17T10:00:00Z',
  },
  {
    id: 3,
    title: '채권 투자의 이해',
    body: '채권은 정부나 기업이 자금 조달을 위해 발행하는 부채 증권입니다. 만기일과 이자율이 정해져 있어 상대적으로 안정적인 투자 수단으로 꼽힙니다. 채권 투자의 기본 개념과 리스크 요소를 알아봅니다.',
    category: '채권',
    publishedAt: '2025-04-16T11:00:00Z',
  },
  {
    id: 4,
    title: '부동산 투자 트렌드 분석',
    body: '2025년 부동산 시장은 금리 변화와 공급 정책에 따라 지역별로 상이한 흐름을 보이고 있습니다. 아파트, 오피스텔, 상가 등 부동산 유형별 투자 전망과 주의사항을 분석합니다.',
    category: '부동산',
    publishedAt: '2025-04-15T12:00:00Z',
  },
  {
    id: 5,
    title: '암호화폐 리스크 관리 방법',
    body: '암호화폐 시장은 높은 변동성으로 인해 신중한 리스크 관리가 필수입니다. 포지션 사이즈 관리, 손절 기준 설정, 분산 투자 방법 등 실전에서 활용할 수 있는 리스크 관리 전략을 소개합니다.',
    category: '암호화폐',
    publishedAt: '2025-04-14T13:00:00Z',
  },
  {
    id: 6,
    title: '퇴직연금 포트폴리오 구성하기',
    body: '퇴직연금은 장기 투자 상품으로 시간이 자산을 키워주는 구조입니다. DC형과 IRP의 차이, 자산 배분 전략, 펀드 선택 기준 등 퇴직연금을 효율적으로 운용하는 방법을 알아봅니다.',
    category: '연금',
    publishedAt: '2025-04-13T14:00:00Z',
  },
  {
    id: 101,
    title: '2025년 금리 전망과 투자 전략',
    body: '미국 연준의 금리 결정과 한국은행의 기준금리 변화가 투자 환경에 미치는 영향을 분석합니다. 금리 인하 사이클에서 유리한 자산 유형과 포트폴리오 재편 전략을 제시합니다.',
    category: '금리',
    publishedAt: '2025-04-24T09:00:00Z',
  },
  {
    id: 102,
    title: '달러 강세 시대의 환율 헤지 방법',
    body: '달러 강세 국면에서 해외 투자 자산의 환율 리스크를 최소화하는 전략을 소개합니다. 환헤지 펀드, 달러 예금, 외화 분산 보유 등 다양한 방법을 비교 분석합니다.',
    category: '환율',
    publishedAt: '2025-04-23T14:30:00Z',
  },
  {
    id: 103,
    title: '배당주 투자로 안정적인 수익 만들기',
    body: '배당주는 주가 상승과 배당금 두 가지 수익원을 제공합니다. 고배당주와 배당성장주의 차이, 배당 수익률 계산 방법, 국내외 우량 배당주 선별 기준을 알아봅니다.',
    category: '주식',
    publishedAt: '2025-04-22T11:00:00Z',
  },
  {
    id: 104,
    title: '인플레이션 시대의 자산 배분 전략',
    body: '인플레이션이 지속되는 환경에서 실질 구매력을 보전하기 위한 자산 배분 전략을 소개합니다. 물가연동채권(TIPS), 원자재, 부동산 등 인플레이션 헤지 자산의 특성을 분석합니다.',
    category: '자산관리',
    publishedAt: '2025-04-21T16:00:00Z',
  },
  {
    id: 105,
    title: '해외 주식 직접 투자 가이드',
    body: '미국 주식을 비롯한 해외 주식 직접 투자 방법과 주의사항을 안내합니다. 증권사별 해외 주식 서비스 비교, 세금 처리, 환전 전략 등 실전에 필요한 정보를 정리했습니다.',
    category: '주식',
    publishedAt: '2025-04-20T10:00:00Z',
  },
  {
    id: 106,
    title: '리츠(REITs) 투자 완전 정복',
    body: '리츠는 부동산에 간접 투자하면서 배당 수익을 얻을 수 있는 금융 상품입니다. 국내 상장 리츠와 해외 리츠의 차이, 투자 시 고려할 핵심 지표와 섹터별 전망을 살펴봅니다.',
    category: '부동산',
    publishedAt: '2025-04-19T13:00:00Z',
  },
  {
    id: 201,
    title: '지금 주목해야 할 글로벌 ETF TOP 5',
    body: '최근 시장 트렌드를 반영한 글로벌 ETF 상품을 소개합니다. AI, 클린에너지, 인도 시장 등 성장 잠재력이 높은 테마별 ETF를 선정 기준과 함께 분석합니다.',
    category: 'ETF',
    publishedAt: '2025-04-20T09:00:00Z',
  },
  {
    id: 202,
    title: '초보자도 쉽게 따라하는 적립식 투자',
    body: '매달 일정 금액을 투자하는 적립식 투자의 장단점을 알아봅니다. 코스트 에버리징 효과로 변동성 리스크를 줄이는 원리와 실제 적용 방법을 단계별로 설명합니다.',
    category: '투자기초',
    publishedAt: '2025-04-19T09:00:00Z',
  },
  {
    id: 203,
    title: '포트폴리오 분산 투자의 기초',
    body: '리스크를 줄이기 위한 자산 배분의 기본 원칙을 알아봅니다. 주식과 채권의 역상관 관계, 국내외 분산, 섹터 분산 등 효율적 포트폴리오 구성 방법을 소개합니다.',
    category: '자산관리',
    publishedAt: '2025-04-18T09:00:00Z',
  },
  {
    id: 204,
    title: '2025 글로벌 경제 전망',
    body: '미국, 유럽, 아시아 경제 동향과 투자 시사점을 분석합니다. 주요국의 통화 정책, 무역 환경 변화, 지정학적 리스크가 글로벌 자산 시장에 미치는 영향을 전망합니다.',
    category: '경제',
    publishedAt: '2025-04-17T09:00:00Z',
  },
  {
    id: 301,
    title: '나의 투자 성향에 맞는 포트폴리오',
    body: '분석된 투자 성향을 기반으로 맞춤형 포트폴리오를 제안합니다. 안정형, 중립형, 공격형 성향별로 적합한 자산 배분 비율과 추천 상품을 안내합니다.',
    category: '자산관리',
    publishedAt: '2025-04-16T09:00:00Z',
  },
  {
    id: 302,
    title: '최근 조회한 종목 심층 분석',
    body: '관심 종목에 대한 상세한 분석 리포트를 확인하세요. 재무제표 핵심 지표, 경쟁사 비교, 향후 성장 전망 등을 체계적으로 분석하는 방법을 소개합니다.',
    category: '주식',
    publishedAt: '2025-04-15T09:00:00Z',
  },
  {
    id: 303,
    title: '나의 퀴즈 오답 복습 자료',
    body: '틀린 문제와 관련된 심화 학습 자료를 모아드렸습니다. 자주 틀리는 개념을 반복 학습하고 실전 적용 능력을 높이는 효과적인 복습 방법을 제안합니다.',
    category: '학습',
    publishedAt: '2025-04-14T09:00:00Z',
  },
];

export const CONTENT_DETAIL_MAP = new Map<number, ContentDetail>(
  CONTENT_DETAILS.map((item) => [item.id, item]),
);
