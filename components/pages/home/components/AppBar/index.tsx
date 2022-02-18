import { useForm } from 'react-hook-form'
import React, { useCallback, useContext } from 'react'
import { HomeContext } from '../../contexts/home.provider'

const AppBar = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const { stockCode, setStockCode } = useContext(HomeContext)

  const onSubmit = useCallback((formData) => {
    if (formData.stockCode) {
      setStockCode(formData.stockCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <header className="h-30 flex items-center px-4">
      <div className="navbar bg-base-100">
        <div className="flex-1 divide-x">
          <a className="btn btn-ghost normal-case text-xl">HOMEWORK</a>
          <span>{stockCode}</span>
        </div>
        <div className="flex-none gap-2">
          <div className="form form-control">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search…"
                  className="input input-bordered"
                  {...register('stockCode', {
                    required: true,
                    maxLength: 30,
                  })}
                />
                <button className="btn btn-square">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppBar
