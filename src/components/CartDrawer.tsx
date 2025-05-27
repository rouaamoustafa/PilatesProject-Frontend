import { useSelector, useDispatch } from 'react-redux'
import { selectCartLines } from '@/store/selectors'
import { Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { clearGuest } from '@/store/slices/guestCartSlice'

export function CartDrawer({ open, onClose }: { open: boolean, onClose: () => void }) {
  const lines = useSelector(selectCartLines)
  const subtotal = lines.reduce((sum, l) => sum + l.course.price * (l.qty ?? 1), 0)
  const router = useRouter()
  const dispatch = useDispatch()

  // **Remove: if (!open) return null**

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 33 }}
            className="fixed top-0 right-0 h-full w-[380px] max-w-full bg-white shadow-2xl z-50 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-2xl font-extrabold text-[#2e372c]">Your Class</h2>
              <button onClick={onClose} className="p-2">
                <X className="w-6 h-6 text-[#2e372c]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {lines.length === 0 ? (
                <div className="text-gray-400 text-center mt-10">Your cart is empty.</div>
              ) : (
                lines.map(l => (
                  <div key={l.id} className="flex items-center justify-between bg-[#f7f6f3] rounded-lg p-4">
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-[#2e372c]">{l.course.title}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-[#335B4B]">${(l.course.price * (l.qty ?? 1)).toFixed(2)}</div>
                      <button
                        onClick={() => dispatch(clearGuest())}
                        className="rounded-full bg-white border border-gray-300 hover:bg-red-50 transition p-2"
                        title="Remove"
                      >
                        <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-600 transition" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-4 border-t">
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-[#2e372c]">Total</span>
                <span className="text-[#335B4B]">${subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  onClose()
                  router.push('/cart')
                }}
                disabled={lines.length === 0}
                className="w-full mt-6 bg-[#203529] text-white py-3 rounded-lg text-lg font-bold shadow-lg hover:bg-[#335B4B] transition disabled:opacity-60"
              >
                Checkout
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
