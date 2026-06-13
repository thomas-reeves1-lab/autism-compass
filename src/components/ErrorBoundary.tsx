import { Component, type ReactNode } from 'react'
import { AlertTriangle } from './icons'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="glass w-full max-w-md p-8 text-center">
            <div
              className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl"
              style={{ background: 'rgba(185,28,28,0.09)', border: '1px solid rgba(185,28,28,0.18)' }}
            >
              <AlertTriangle size={26} className="text-danger" />
            </div>
            <h1 className="mb-2 text-xl font-black text-brand-deep">Something went wrong</h1>
            <p className="mb-5 text-sm text-slate-600">
              The tool hit an unexpected error. Your data is safe — it stays on your device only, so nothing has been lost.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-sm"
            >
              Reload the tool
            </button>
            <p className="mt-5 text-xs text-slate-400">
              Education only &middot; Not medical advice &middot; Always speak to the treating doctor.
            </p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
