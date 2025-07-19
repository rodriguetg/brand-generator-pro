import jsPDF from 'jspdf'
import { Project } from '@prisma/client'

export class PDFExportService {
  private doc: jsPDF

  constructor() {
    this.doc = new jsPDF()
  }

  async exportProject(project: {
    name: string
    sector: string
    style: string
    brandNames: string[]
    slogans: string[]
    createdAt: Date
  }): Promise<Blob> {
    // Configuration du document
    this.doc = new jsPDF()
    this.doc.setFont('helvetica')
    
    // Header
    this.addHeader(project.name)
    
    // Informations du projet
    this.addProjectInfo(project)
    
    // Noms de marque
    this.addBrandNames(project.brandNames)
    
    // Slogans
    this.addSlogans(project.slogans)
    
    // Footer
    this.addFooter()
    
    return this.doc.output('blob')
  }

  private addHeader(projectName: string) {
    // Logo/Titre
    this.doc.setFontSize(24)
    this.doc.setTextColor(99, 102, 241) // brand-500
    this.doc.text('Brand Generator Pro', 20, 30)
    
    // Nom du projet
    this.doc.setFontSize(18)
    this.doc.setTextColor(0, 0, 0)
    this.doc.text(`Projet: ${projectName}`, 20, 50)
    
    // Ligne de séparation
    this.doc.setDrawColor(229, 231, 235) // gray-200
    this.doc.line(20, 60, 190, 60)
  }

  private addProjectInfo(project: any) {
    let yPos = 80
    
    this.doc.setFontSize(12)
    this.doc.setTextColor(75, 85, 99) // gray-600
    
    this.doc.text(`Secteur: ${project.sector}`, 20, yPos)
    yPos += 10
    this.doc.text(`Style: ${project.style}`, 20, yPos)
    yPos += 10
    this.doc.text(`Date de création: ${new Date(project.createdAt).toLocaleDateString('fr-FR')}`, 20, yPos)
  }

  private addBrandNames(brandNames: string[]) {
    let yPos = 120
    
    // Titre section
    this.doc.setFontSize(16)
    this.doc.setTextColor(0, 0, 0)
    this.doc.text('Noms de Marque Générés', 20, yPos)
    yPos += 15
    
    // Liste des noms
    this.doc.setFontSize(12)
    this.doc.setTextColor(55, 65, 81) // gray-700
    
    brandNames.forEach((name, index) => {
      if (yPos > 250) {
        this.doc.addPage()
        yPos = 30
      }
      
      this.doc.text(`${index + 1}. ${name}`, 30, yPos)
      yPos += 8
    })
  }

  private addSlogans(slogans: string[]) {
    let yPos = this.doc.internal.pageSize.height - 100
    
    if (slogans.length > 0) {
      // Vérifier si on a besoin d'une nouvelle page
      if (yPos < 150) {
        this.doc.addPage()
        yPos = 30
      }
      
      // Titre section
      this.doc.setFontSize(16)
      this.doc.setTextColor(0, 0, 0)
      this.doc.text('Slogans Générés', 20, yPos)
      yPos += 15
      
      // Liste des slogans
      this.doc.setFontSize(12)
      this.doc.setTextColor(55, 65, 81)
      
      slogans.forEach((slogan, index) => {
        if (yPos > 250) {
          this.doc.addPage()
          yPos = 30
        }
        
        this.doc.text(`${index + 1}. ${slogan}`, 30, yPos)
        yPos += 8
      })
    }
  }

  private addFooter() {
    const pageCount = this.doc.internal.pages.length - 1
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      
      // Footer
      this.doc.setFontSize(8)
      this.doc.setTextColor(156, 163, 175) // gray-400
      this.doc.text(
        `Généré par Brand Generator Pro - Page ${i}/${pageCount}`,
        20,
        this.doc.internal.pageSize.height - 10
      )
      
      this.doc.text(
        new Date().toLocaleDateString('fr-FR'),
        190,
        this.doc.internal.pageSize.height - 10,
        { align: 'right' }
      )
    }
  }

  async exportMultipleProjects(projects: any[]): Promise<Blob> {
    this.doc = new jsPDF()
    
    // Page de couverture
    this.addCoverPage(projects.length)
    
    // Exporter chaque projet
    for (let i = 0; i < projects.length; i++) {
      this.doc.addPage()
      await this.exportProject(projects[i])
    }
    
    return this.doc.output('blob')
  }

  private addCoverPage(projectCount: number) {
    this.doc.setFontSize(28)
    this.doc.setTextColor(99, 102, 241)
    this.doc.text('Brand Generator Pro', 105, 100, { align: 'center' })
    
    this.doc.setFontSize(16)
    this.doc.setTextColor(0, 0, 0)
    this.doc.text('Rapport de Projets', 105, 120, { align: 'center' })
    
    this.doc.setFontSize(12)
    this.doc.setTextColor(75, 85, 99)
    this.doc.text(`${projectCount} projet(s) inclus`, 105, 140, { align: 'center' })
    this.doc.text(new Date().toLocaleDateString('fr-FR'), 105, 155, { align: 'center' })
  }
}

export const pdfExportService = new PDFExportService()