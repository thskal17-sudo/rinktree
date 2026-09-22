/**
 * 사이트 공통 콘텐츠 (기관 정보 · 통계 · 링크 카드 · 연락처)
 *
 * ※ 이 파일의 문구·숫자·URL은 프로토타입 기준 예시값입니다.
 *    실제 운영 문구로 교체해 주세요. 교체가 필요한 항목은 TODO로 표시했습니다.
 *    코드 수정 없이 이 파일만 고치면 사이트 전체에 반영됩니다.
 */

export const site = {
  name: '한국엑스퍼트교육원',
  shortName: '한국엑스퍼트교육원',
  tagline: '현장을 아는 전문가가 조직의 성장을 설계합니다',
  description:
    '리더십·직무역량·세일즈 교육을 기업과 기관에 맞춰 설계하고 운영하는 교육 전문 기관입니다.',

  /** 배포 도메인. Vercel 환경변수 NEXT_PUBLIC_SITE_URL로 덮어쓸 수 있습니다. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kexpertedu.co.kr',

  contact: {
    email: 'thska89@naver.com',
    /** TODO: 실제 카카오톡 채널 주소로 교체 */
    kakao: 'https://pf.kakao.com/',
    /** TODO: 실제 인스타그램 계정 주소로 교체 */
    instagram: 'https://instagram.com/',
  },

  /** 홈허브 상단 통계 타일 3개. TODO: 실제 실적 수치로 교체 */
  stats: [
    { value: '12년', label: '교육 운영 경력' },
    { value: '240+', label: '함께한 기업·기관' },
    { value: '96%', label: '교육 만족도' },
  ],

  /** 홈허브 링크 카드 4개 */
  links: [
    {
      href: '/about',
      title: '회사소개',
      description: '설립 철학과 연혁, 강사진을 소개합니다',
      icon: 'building',
    },
    {
      href: '/programs',
      title: '교육프로그램소개',
      description: '리더십·직무역량·세일즈 분야별 과정',
      icon: 'book',
    },
    {
      href: '/inquiry',
      title: '교육문의',
      description: '교육 일정과 견적을 상담해 드립니다',
      icon: 'chat',
      featured: true,
    },
    {
      href: '/recruit',
      title: '강사잇다',
      description: '함께할 전문 강사를 모십니다',
      icon: 'users',
    },
  ],
} as const

export type SiteLink = (typeof site.links)[number]
