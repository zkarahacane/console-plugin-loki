import { Gitlab } from '@gitbeaker/core'

interface Group {
    id: number;
    name: string;
    full_path: string;
    web_url: string;
}

interface Project {
id: number;
name: string;
web_url: string;
}

// Fonction pour vérifier l'existence d'un groupe
export const findGroup = async (api: Gitlab, groupName: string): Promise<Group | undefined> => {
  const groups = await api.Groups.search(groupName)
  return groups.find(g => g.full_path === groupName || g.name === groupName)
}

// Fonction pour créer un groupe
export const createGroup = async (api: Gitlab, groupName: string): Promise<Group> => {
  const group = await api.Groups.create(groupName,'/path/to/project')
  console.log(`Groupe créé: ${group.web_url}`)
  return group
}

export const findProject = async (api: Gitlab, group: Group, projectName: string): Promise<Project | undefined> => {
  const projects: Project [] = await api.Groups.allProjects(group.id)
  const project = projects.find(p => p.name === projectName)
  return project
}

// export const createProject = async (api: Gitlab, group: Group, projectName: string): Promise<Project> => {
//   const project = await api.Projects.create(namespace_id: group.id,name: projectName)
//   return project
// }

// Fonction pour vérifier l'existence d'un fichier dans le dépôt
export const fileExistsInRepo = async (api: Gitlab, project: Project, filePath: string, branch: string): Promise<boolean> => {
  try {
    await api.RepositoryFiles.show(project.id, filePath, branch)
    return true
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return false
    }
    throw error
  }
}

// // Fonction pour récupérer le contenu d'un fichier YAML
// const getGitlabYamlFileContent = async (api: Gitlab, project: Project, filePath: string, branch: string): Promise<object> => {
//   const file = await api.RepositoryFiles.show(project.id, filePath, branch)
//   const content = Buffer.from(file.content, 'base64').toString('utf-8')
//   const doc = new Document(content)
//   return doc.toJSON()
// }

// Fonction pour éditer, committer et pousser un fichier YAML
export const commitAndPushYamlFile = async (api: Gitlab, project: Project, filePath: string, yamlContent: object, branch: string, commitMessage: string, yamlString: string): Promise<void> => {
  // Créer ou mettre à jour le fichier dans le dépôt
  await api.RepositoryFiles.create(project.id, filePath, branch,yamlString,commitMessage)
  console.log(`Fichier YAML commité et poussé: ${filePath}`)
}
