import Home from "./page"
import Form from "./components/Form"

export default function RootLayout({ children }) {
  return (
    <div>
      <Home />
      <Form />
    </div>
  )
}
