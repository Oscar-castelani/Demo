import {
  siFigma, siGooglecalendar, siGoogledocs, siGoogledrive, siGoogleforms, siGooglemeet, siGooglesheets, siMeta,
  siTrello, siWhatsapp,
} from 'simple-icons'

export type ToolCategory = 'Organización' | 'Documentos' | 'Diseño' | 'Comunicación' | 'Presencia digital'

export interface ToolIcon {
  path: string
  hex: string
}

export interface Tool {
  id: string
  name: string
  category: ToolCategory
  /** Para qué se usa dentro de un proyecto. */
  usage: string
  url: string
  /** Condición gratuita; los planes pueden cambiar, por eso se aclara en la pantalla. */
  free: string
  /** Logo oficial de `simple-icons`; si no existe, se usa un símbolo genérico (`glyph`). */
  icon?: ToolIcon
  glyph?: 'design' | 'place'
  /** Si la herramienta se usó en la prueba piloto. */
  pilot?: boolean
}

const fromSi = (i: { path: string; hex: string }): ToolIcon => ({ path: i.path, hex: `#${i.hex}` })

export const TOOLS: Tool[] = [
  {
    id: 'trello', name: 'Trello', category: 'Organización', pilot: true,
    usage: 'Tableros para organizar tareas, responsables y avances del equipo.',
    url: 'https://trello.com', free: 'Plan gratuito', icon: fromSi(siTrello),
  },
  {
    id: 'calendar', name: 'Google Calendar', category: 'Organización',
    usage: 'Agenda de reuniones con el comercio y fechas de entrega.',
    url: 'https://calendar.google.com', free: 'Gratuita', icon: fromSi(siGooglecalendar),
  },
  {
    id: 'drive', name: 'Google Drive', category: 'Documentos', pilot: true,
    usage: 'Carpeta compartida para fotos, logos y archivos del proyecto.',
    url: 'https://drive.google.com', free: 'Plan gratuito', icon: fromSi(siGoogledrive),
  },
  {
    id: 'docs', name: 'Google Docs', category: 'Documentos', pilot: true,
    usage: 'Documentos para escribir en equipo: acuerdos, textos y actas de reunión.',
    url: 'https://docs.google.com', free: 'Gratuita', icon: fromSi(siGoogledocs),
  },
  {
    id: 'sheets', name: 'Google Sheets', category: 'Documentos',
    usage: 'Planillas para listas de productos, precios y planificación.',
    url: 'https://sheets.google.com', free: 'Gratuita', icon: fromSi(siGooglesheets),
  },
  {
    id: 'forms', name: 'Google Forms', category: 'Documentos',
    usage: 'Formularios para encuestas a clientes o pedidos simples.',
    url: 'https://forms.google.com', free: 'Gratuita', icon: fromSi(siGoogleforms),
  },
  {
    id: 'canva', name: 'Canva', category: 'Diseño', pilot: true,
    usage: 'Diseño de publicaciones, plantillas y piezas gráficas con la identidad del comercio.',
    url: 'https://www.canva.com', free: 'Plan gratuito', glyph: 'design',
  },
  {
    id: 'figma', name: 'Figma', category: 'Diseño',
    usage: 'Diseño colaborativo de pantallas, prototipos y piezas gráficas, con comentarios del equipo y del comercio.',
    url: 'https://www.figma.com', free: 'Plan gratuito', icon: fromSi(siFigma),
  },
  {
    id: 'meet', name: 'Google Meet', category: 'Comunicación',
    usage: 'Videollamadas para reunirse con el comercio y con el docente.',
    url: 'https://meet.google.com', free: 'Plan gratuito', icon: fromSi(siGooglemeet),
  },
  {
    id: 'whatsapp', name: 'WhatsApp Business', category: 'Comunicación',
    usage: 'Atención a clientes, catálogo de productos y respuestas rápidas.',
    url: 'https://business.whatsapp.com', free: 'Aplicación gratuita', icon: fromSi(siWhatsapp),
  },
  {
    id: 'meta', name: 'Meta Business Suite', category: 'Presencia digital',
    usage: 'Programar publicaciones, responder mensajes y ver estadísticas de las redes del comercio.',
    url: 'https://business.facebook.com', free: 'Gratuita', icon: fromSi(siMeta),
  },
  {
    id: 'gbp', name: 'Perfil de Empresa de Google', category: 'Presencia digital',
    usage: 'Ficha del negocio en Google Maps y en el buscador, con horarios, fotos y reseñas.',
    url: 'https://www.google.com/business/', free: 'Gratuita', glyph: 'place',
  },
]

export const TOOL_CATEGORIES: ToolCategory[] = ['Organización', 'Documentos', 'Diseño', 'Comunicación', 'Presencia digital']
