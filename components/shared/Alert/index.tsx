import { useCallback, useEffect, useState } from 'react'

type Props = {
  title: string
  message?: string
  isOpen: boolean
  onClose?: () => void
}

const AlertDialog = ({ title, message, isOpen, onClose }: Props) => {
  const [open, setOpen] = useState(isOpen)

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = useCallback(() => {
    setOpen(false)
    if (onClose) {
      onClose()
    }
  }, [onClose])

  let openCx = ''
  if (open) {
    openCx = 'modal-open'
  }
  return (
    <div className={`modal ${openCx}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button type="button" onClick={handleClose}>
            <label htmlFor="my-modal" className="btn">
              Ok
            </label>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AlertDialog
