import type { Metadata } from 'next'
import { getCertificaciones, getDistribucion, getHomeContent, getMarcasPropias, getSectores } from '@/lib/home'
import { getAllProductos } from '@/lib/productos'
import { getAllNoticias } from '@/lib/noticias'
import { HeroSection } from './_components/HeroSection'
import { QuickLinksSection } from './_components/QuickLinksSection'
import { ConfianzaSection } from './_components/ConfianzaSection'
import { MarcasPropiasSection } from './_components/MarcasPropiasSection'
import { DistribucionSection } from './_components/DistribucionSection'
import { PropositoSection } from './_components/PropositoSection'
import { ProductosSection } from './_components/ProductosSection'
import { SectoresSection } from './_components/SectoresSection'
import { NoticiasSection } from './_components/NoticiasSection'
import { CertificacionesSection } from './_components/CertificacionesSection'
import { ContactoSection } from './_components/ContactoSection'

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Marea Alta: 33 años fabricando soluciones de cadena de frío para las industrias farmacéutica, alimentaria y logística en Chile.',
}

export default async function HomePage() {
  const [content, sectores, certificaciones, marcasPropias, distribucion, productos, noticias] = await Promise.all([
    getHomeContent(),
    getSectores(),
    getCertificaciones(),
    getMarcasPropias(),
    getDistribucion(),
    getAllProductos(),
    getAllNoticias(),
  ])

  return (
    <>
      <HeroSection hero={content.hero} />
      <QuickLinksSection />
      <ConfianzaSection confianza={content.confianza} />
      <MarcasPropiasSection marcas={marcasPropias} />
      <DistribucionSection distribucion={distribucion} />
      <PropositoSection proposito={content.proposito} vision={content.vision} mision={content.mision} />
      <ProductosSection productos={productos} />
      <SectoresSection sectores={sectores} />
      <NoticiasSection noticias={noticias} />
      <CertificacionesSection certificaciones={certificaciones} />
      <ContactoSection />
    </>
  )
}
