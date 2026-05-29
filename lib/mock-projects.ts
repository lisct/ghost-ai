export interface Project {
  id: string
  name: string
  slug: string
  isOwned: boolean
}

export const MOCK_MY_PROJECTS: Project[] = [
  { id: "1", name: "E-Commerce Platform", slug: "e-commerce-platform", isOwned: true },
  { id: "2", name: "Analytics Dashboard", slug: "analytics-dashboard", isOwned: true },
]

export const MOCK_SHARED_PROJECTS: Project[] = [
  { id: "3", name: "Mobile App Redesign", slug: "mobile-app-redesign", isOwned: false },
]
