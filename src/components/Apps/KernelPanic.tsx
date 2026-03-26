import { useEffect, useState } from 'react'
import './KernelPanic.css'

interface Props {
  onRecover: () => void
}

export function KernelPanic({ onRecover }: Props) {
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (countdown <= 0) { onRecover(); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, onRecover])

  return (
    <div className="kernel-panic">
      <div className="kp-content">
        <p className="kp-title">SlashDot OS — Kernel Panic</p>
        <div className="kp-divider" />
        <pre className="kp-ascii">{`
  ██╗  ██╗███████╗██████╗ ███╗   ██╗███████╗██╗         
  ██║ ██╔╝██╔════╝██╔══██╗████╗  ██║██╔════╝██║         
  █████╔╝ █████╗  ██████╔╝██╔██╗ ██║█████╗  ██║         
  ██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╗██║██╔══╝  ██║         
  ██║  ██╗███████╗██║  ██║██║ ╚████║███████╗███████╗    
  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝    
                        PANIC                            `}
        </pre>
        <div className="kp-divider" />
        <p className="kp-error">FATAL ERROR: 0x000000SLASHDOT_OS_EXCEPTION</p>
        <p className="kp-desc">A critical error has occurred. The system has been halted to prevent damage.</p>
        <div className="kp-details">
          <p>Error code    : 0xDEADBEEF</p>
          <p>Process       : exam-stress.exe (PID 9999)</p>
          <p>Address       : 0x25MS00001337</p>
          <p>Cause         : Too many browser tabs</p>
          <p>Coffee level  : CRITICAL (0%)</p>
          <p>Sleep hours   : 0 (not enough)</p>
          <p>Deadline      : April 11, 2026 (imminent)</p>
        </div>
        <div className="kp-divider" />
        <p className="kp-stack">Stack trace:</p>
        <pre className="kp-trace">{`  at procrastinate() [procrastinate.exe:420]
  at openYouTube() [browser.exe:1337]
  at ignoreDeadline() [brain.exe:404]
  at submitAtLastMinute() [anxiety.exe:999]
  at SlashDotOS.boot() [slashdot-os.tsx:1]`}
        </pre>
        <div className="kp-divider" />
        <p className="kp-recover">
          System will attempt to recover in{' '}
          <span className="kp-countdown">{countdown}</span>
          {' '}seconds...
        </p>
        <p className="kp-hint">or type 'reboot' in the terminal</p>
      </div>
    </div>
  )
}