'use client'

type Props = {
  action: () => Promise<void>
}

export default function DeleteExerciseButton({ action }: Props) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!confirm('¿Eliminar este ejercicio?')) return
    await action()
  }

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        className="w-full rounded-xl py-3 text-base font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
      >
        Eliminar ejercicio
      </button>
    </form>
  )
}
