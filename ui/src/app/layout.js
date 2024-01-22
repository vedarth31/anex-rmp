import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Home from './page.js'
import Form from './components/Form'
import Info from './components/Info'
// import 'bootstrap/dist/css/bootstrap.min.css';
import EnhancedTable from './components/EnhancedTable';
import '@mui/material'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}
        <Header />
        <Form />
      </body>
      <Footer />
    </html>
  )
}
