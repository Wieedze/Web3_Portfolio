import { projects } from '../../data/projects'
import ProjectCard from './ProjectCard'

export default function ProjectGrid() {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-24">
      <h2 className="text-2xl font-semibold text-white mb-8">Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
