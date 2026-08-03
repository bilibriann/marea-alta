import type { Metadata } from 'next'
import { getHomeContent, getSectores } from '@/lib/home'
import { HeroSection } from './_components/HeroSection'
import { QuickLinksSection } from './_components/QuickLinksSection'
import { ConfianzaSection } from './_components/ConfianzaSection'
import { SectoresSection } from './_components/SectoresSection'
import { ContactoSection } from './_components/ContactoSection'

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Marea Alta: 33 años fabricando soluciones de cadena de frío para las industrias farmacéutica, alimentaria y logística en Chile.',
}

export default async function HomePage() {
  const [content, sectores] = await Promise.all([getHomeContent(), getSectores()])

  return (
    <>
      <HeroSection hero={content.hero} />
      <QuickLinksSection />
      <ConfianzaSection confianza={content.confianza} />
      <SectoresSection sectores={sectores} />
      <ContactoSection />
    </>
  )
}
