import styles from './page.module.css'
import { Auth } from '@/components/Auth';
import { Main } from '@/components/Main'

export default function Home() {
  return (
    <main className={styles.main}>
      <Auth>
        <Main />
      </Auth>
    </main>
  )
}
