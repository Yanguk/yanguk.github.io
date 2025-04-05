interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Visual-system',
    description: `부트캠프 개인 프로젝트로 진행한 시스템 모니터링앱입니다.`,
    imgSrc: '/static/images/visual-system.png',
    href: 'https://github.com/Yanguk/Visual-system',
  },
]

export default projectsData
