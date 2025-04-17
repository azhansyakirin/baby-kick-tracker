import * as Dialog from '@radix-ui/react-dialog'

export default function Modal({ trigger, title, children, footer }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content
          className="fixed bg-white rounded-xl shadow-lg p-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md"
        >
          {title && (
            <Dialog.Title className="text-xl font-bold mb-4">{title}</Dialog.Title>
          )}
          <div className="flex flex-col gap-4">
            {children}
          </div>

          {footer && (
            <div className="mt-6 flex justify-end gap-2">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
