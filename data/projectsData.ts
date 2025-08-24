interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Visual System',
    description: `Vanilla JS + electron + D3.js 로 구성된 시스템 모니터링앱`,
    imgSrc: '/static/images/visual-system.png',
    href: 'https://github.com/Yanguk/Visual-system',
  },
  {
    title: 'Circle',
    description: `WebRTC와 Socket.io를 기반으로 구현된 실시간 음성 채팅 서비스`,
    imgSrc: '/static/images/circle-project.png',
    href: 'https://github.com/Team-TTT/Circle-Service-FE',
  },
  {
    title: 'Bridge Project',
    description: `1:1 맞춤 공부습관 바로잡기`,
    imgSrc: '/static/images/bridge-project.svg',
    href: 'https://briiidgeproject.com',
  },
]

export default projectsData
