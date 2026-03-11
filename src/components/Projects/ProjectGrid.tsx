import { projects } from '../../data/projects'
import ProjectCard from './ProjectCard'

export default function ProjectGrid() {
  return (
    <section className="max-w-6xl mx-auto px-8 pb-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
