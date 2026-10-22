import { ButtonLink } from '../../components/ui/Button'

const content = {
  forbidden: { code: '403', title: "You don't have access to this page" },
  notFound: { code: '404', title: 'Page not found' },
  suspended: { code: '', title: 'Your account is suspended. Contact support for help.' },
  deactivated: { code: '', title: 'This account has been deactivated.' },
}

export default function SystemPage({ kind }: { kind: keyof typeof content }) {
  const { code, title } = content[kind]
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      {code && <p className="text-5xl font-bold text-brand-dark">{code}</p>}
      <h1 className="mt-4 text-xl font-semibold">{title}</h1>
      <ButtonLink to="/mentors" variant="secondary" className="mt-6">
        Browse mentors
      </ButtonLink>
    </div>
  )
}
