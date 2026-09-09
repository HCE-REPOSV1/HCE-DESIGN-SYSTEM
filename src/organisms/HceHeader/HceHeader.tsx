import "./HceHeader.css"
import { Menu } from "../../atoms/Menu/Menu"
import { hceColors, hceTypography, hceShadows } from "../../tokens/hce.tokens"
import { LogoutIcon, HceBurgerIcon } from "../../atoms/Icon/SvgIconsHce"
import { useDsTenant } from "../../provider/ThemeProvider"
import { getCompanyBranding } from "../../theme/companyBranding"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { HceTooltip } from "../../atoms/HceTooltip/HceTooltip"
// ─── Tipos públicos ───────────────────────────────────────────────────────────

export type Sucursal = {
  id:     string | number
  nombre: string
}

export type HceNotificacion = {
  id:          number
  titulo:      string
  descripcion: string
  tipo:        "info" | "warning" | "success" | "error"
  /** Texto de fecha/hora a mostrar (ej: "Hace 2 horas", "Hoy"). Opcional. */
  fecha?:      string
  leida?:      boolean
}


//────────────────────────────────────────────

export type HceHeaderVariant = "default" | "tv"

// ─── Configuración visual por tipo ────────────────────────────────────────────

// const TIPO_CONFIG: Record<HceNotificacion["tipo"], {
//   color:   string
//   bgLight: string
//   Icon:    React.FC<{ color?: string; size?: number }>
// }> = {
//   info: {
//     // blue[500]/blue[50] == --ds-color-primary/-light (csf) exactamente —
//     // reactivo al tema activo de DSProvider, mismos hex de siempre como fallback.
//     color:   `var(--ds-color-primary, ${"var(--ds-color-primary, #0043a5)"})`,
//     bgLight: `var(--ds-color-primary-light, ${"var(--ds-color-primary-light, #e5e7eb)"})`,
//     Icon:    HceInfoIcon,
//   },
//   warning: {
//     color:   hceColors.alert.warning[500],
//     bgLight: hceColors.alert.warning[50],
//     Icon:    DangerIcon,
//   },
//   success: {
//     color:   hceColors.alert.success[500],
//     bgLight: hceColors.alert.success[50],
//     Icon:    CheckedCircleIcon,
//   },
//   error: {
//     color:   hceColors.alert.error[500],
//     bgLight: hceColors.alert.error[50],
//     Icon:    WarningIcon,
//   },
// }

// Notificaciones de ejemplo — en producción se pasan via props desde la API
const NOTIF_EJEMPLO: HceNotificacion[] = [
  {
    id:          1,
    titulo:      "Actualiza tu contraseña",
    descripcion: "Por seguridad, te recomendamos cambiarla periódicamente.",
    tipo:        "warning",
    fecha:       "Hace 2 días",
    leida:       false,
  },
  {
    id:          2,
    titulo:      "¡Feliz cumpleaños!",
    descripcion: "Todo el equipo de Clínica San Felipe te desea un excelente día.",
    tipo:        "success",
    fecha:       "Hoy",
    leida:       false,
  },
]

/** Ícono de campana — inline (se integra al sistema de íconos en el paso dedicado) */
function BellGlyph() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}
/** Chevron abajo — inline */
function ChevronDownGlyph({ color = "currentColor", size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type HceHeaderProps = {
  title?: string
  variant?: HceHeaderVariant
  sede?:             string | number
  sucursales?:       Sucursal[]
  onSedeCambiada?:  (sedeId: string | number) => void
  /** Deshabilita el selector de sede aunque existan varias sucursales. */
  sedeDisabled?:     boolean
  /** Texto del tooltip mostrado cuando el selector de sede está deshabilitado. */
  sedeDisabledTooltip?: string
  userName?:         string
  userRole?:         string
  /** URL de la foto de perfil del usuario. Si carga correctamente, reemplaza las iniciales. */
  userPhotoUrl?:     string
  onLogout?:         () => void
  /** Notificaciones externas. Si no se pasan, usa las de ejemplo. */
  notifications?:    HceNotificacion[]
  /** Callback al hacer click en "Ver todas las notificaciones" */
  onVerTodas?:       () => void
  /** Modo flotante: borderRadius + sombra para alinearse con sidebar flotante */
  floating?:         boolean
  /** Callback del botón hamburguesa — visible solo en pantallas pequeñas (< md) */
  onMenuClick?:      () => void
  /** Label de boton para cierre de sesión */
  labelCloseSesion?: string
  /** Slot genérico para acciones adicionales, renderizado antes de la campana (ej. selector de idioma). Oculto en variant="tv" igual que campana/avatar. */
  extraActions?:     ReactNode
  /**
   * Hook de pruebas E2E — id base. Se sufija `-menu-button`, `-notifications`,
   * `-user-menu`, `-logout` en los controles internos.
   */
  testId?: string
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function HceHeader({
  title,
  variant = "default",
  sede,
  sucursales      = [],
  onSedeCambiada,
  sedeDisabled    = false,
  sedeDisabledTooltip = "No se puede cambiar de sede cuando esta abierto una atencion",
  userName        = "Usuario",
  userRole        = "",
  userPhotoUrl,
  onLogout,
  notifications,
  floating        = false,
  onMenuClick,
  labelCloseSesion = "Cerrar Sesión",
  extraActions,
  testId,
}: HceHeaderProps) {
  const tenant = useDsTenant()
  const { Logo: CompanyLogo } = getCompanyBranding(tenant)
  

  const notifTriggerRef = useRef<HTMLButtonElement>(null)
  const userTriggerRef  = useRef<HTMLButtonElement>(null)
  const [userOpen,  setUserOpen]  = useState(false)
  // const [setNotifOpen] = useState(false)

  // Estado interno de notificaciones (leídas/no leídas)
  const [notifs, setNotifs] = useState<HceNotificacion[]>(
    notifications ?? NOTIF_EJEMPLO
  )

  const handleUserClose  = () => setUserOpen(false)
  const handleLogout     = () => { handleUserClose(); onLogout?.() }

  const handleNotifOpen  = () => {
    // setNotifOpen(true)
    // Marca todas como leídas al abrir el panel (mismo comportamiento que Header.tsx)
    setNotifs(prev => prev.map(n => ({ ...n, leida: true })))
  }
  // const handleNotifClose = () => setNotifOpen(false)

  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? "")
    .join("")

  const multiSede    = sucursales.length > 1
  // sede llega como '' (string vacío) del contexto mientras no hay selección — '??' no
  // lo detecta porque '' no es null/undefined, así que el fallback a la primera sede
  // nunca se disparaba. Se usa '||' para cubrir también el caso de string vacío.
  const selectedSede = String(sede || (sucursales[0]?.id ?? ""))
  const unreadCount  = notifs.filter(n => !n.leida).length
  const isTvVariant = variant === "tv"
  const headerTitle = title ??  "Historia Clínica"
  const [fechaHora, setFechaHora] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setFechaHora(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const sedeSelect = (
    <select
      className="hce-hceheader-sede-select"
      value={selectedSede}
      onChange={e => onSedeCambiada?.(e.target.value)}
      disabled={sedeDisabled || !multiSede}
    >
      {sucursales.map(s => (
        <option key={String(s.id)} value={String(s.id)}>
          {s.nombre}
        </option>
      ))}
    </select>
  )

  return (
    <header
      data-testid={testId}
      style={{
        height:           64,
        backgroundColor: 'var(--ds-color-interactive, #003d96)',
        display:         "flex",
        alignItems:      "center",
        padding:          "0 16px",
        width:           "100%",
        flexShrink:      0,
        position:        "relative",
        zIndex:          10,
        boxSizing:       "border-box",
        ...(floating && {
          borderRadius: "12px",
          boxShadow:    hceShadows.float,
        }),
      }}
    >
      {/* ── Izquierda ────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 24, minWidth: 0 }}>

        {/* Hamburguesa — solo visible en pantallas pequeñas (< md = 900px) */}
        {onMenuClick && (
          <button
            type="button"
            className="hce-hceheader-iconbtn hce-hceheader-hamburger"
            onClick={onMenuClick}
            data-testid={testId ? `${testId}-menu-button` : undefined}
          >
            <HceBurgerIcon size={20} color="white" />
          </button>
        )}

  <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 , width: 200,
      maxWidth: "100%"}}>
        <span className="hce-hceheader-title" style={{
          fontFamily: hceTypography.fontFamily,
          color:      "white",
          fontWeight: 600,
          fontSize:   hceTypography.size.xl,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>
         {headerTitle}
        </span>

         
 </div>

        {sucursales.length > 0 && (
          sedeDisabled ? (
            <HceTooltip
              title={sedeDisabledTooltip}
              placement="bottom"
            >
              <span>
                {sedeSelect}
              </span>
            </HceTooltip>
          ) : (
            sedeSelect
          )
        )}

      
      </div>

      {/* ── Centro: logo ─────────────────────────────────────── */}
      <div style={{
        position:      "absolute",
        left:          "50%",
        transform:     "translateX(-50%)",
        display:       "flex",
        alignItems:    "center",
        pointerEvents: "none",
      }}>
        <CompanyLogo width={123} color="white" />
      </div>

    

      {/* ── Derecha ──────────────────────────────────────────── */}
      <div style={{
        flex:           1,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "flex-end",
        gap:            8,
        minWidth:       0,
      }}>

      {isTvVariant  && (
  <>
          <input
            name="sede"
            readOnly
            value={`Sede ${sede ?? ""}`}
            style={{
              fontFamily: hceTypography.fontFamily,
              padding: "4px 0",
              width: "150px",
              maxWidth: "150px",
              textAlign: "center",
              color: 'var(--ds-color-interactive, #1A3A6B)',
              backgroundColor: hceColors.neutro.white[100],
              fontWeight: hceTypography.weight.bold,
              fontSize: "14px",
              borderRadius: "6px",
              border: "none",
              boxSizing: "border-box",
            }}
          />

          <input
            name="fechaHora"
            readOnly
            value={`${fechaHora.toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            })} ${fechaHora.toLocaleTimeString("es-PE", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}`}
            style={{
              fontFamily: "var(--ds-font-family, 'Poppins', sans-serif)",
              padding: "4px 0",
                  fontSize: "14px",
              width: "160px",
              maxWidth: "160px",
              textAlign: "center",
              color: 'var(--ds-color-interactive, #1A3A6B)',
              backgroundColor: hceColors.neutro.white[100],
              fontWeight: hceTypography.weight.bold,
              borderRadius: "6px",
              border: "none",
              boxSizing: "border-box",
            }}
          />
        </>
      )}

        {/* Acciones extra (ej. selector de idioma) */}
      {!isTvVariant && extraActions}

        {/* Campana */}
      {!isTvVariant  && (
          <button
            ref={notifTriggerRef}
            type="button"
            className="hce-hceheader-iconbtn"
            onClick={handleNotifOpen}
            aria-label="Notificaciones"
            data-testid={testId ? `${testId}-notifications` : undefined}
          >
            <span style={{ position: "relative", display: "flex" }}>
              <BellGlyph />
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  minWidth: 15,
                  height: 15,
                  padding: "0 3px",
                  borderRadius: 8,
                  backgroundColor: hceColors.alert.error[500],
                  color: "#fff",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}>
                  {unreadCount}
                </span>
              )}
            </span>
          </button>
        )}

        {/* ── Panel de notificaciones ──────────────────────────── */}
        {/* <Menu
          open={!isTvVariant && notifOpen}
          onClose={handleNotifClose}
          anchorRef={notifTriggerRef}
          align="right"
          aria-label="Notificaciones"
          panelStyle={{
            width:        360,
            borderRadius: "16px",
            boxShadow:    hceShadows.modal,
            overflow:     "hidden",
            border:       `1px solid ${"var(--ds-color-primary-light, #e5e7eb)"}`,
          }}
        > */}
          {/* Cabecera del panel */}
          {/* <div style={{
            padding:         "12px 16px",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "space-between",
            backgroundColor: "var(--ds-color-interactive, #0043a5)",
          }}>
            <span style={{
              fontFamily: hceTypography.fontFamily,
              color:      "white",
              fontWeight: 700,
              fontSize:   "0.85rem",
            }}>
              Notificaciones
            </span>
            <span style={{
              fontFamily:      hceTypography.fontFamily,
              color:           "white",
              fontSize:        "0.7rem",
              backgroundColor: "rgba(255,255,255,0.2)",
              padding:         "2px 8px",
              borderRadius:    "10px",
            }}>
              {notifs.length} nuevas
            </span>
          </div> */}

          {/* Lista de notificaciones */}
          {/* <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {notifs.length === 0 ? (
              <div style={{ padding: "32px 0", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, color: "var(--ds-color-primary-light, #0043a5)" }}>
                  <BellGlyph />
                </div>
                <span style={{
                  fontFamily: hceTypography.fontFamily,
                  fontSize:   "0.82rem",
                  color:      hceColors.neutro.white[900],
                }}>
                  Sin notificaciones
                </span>
              </div>
            ) : (
              notifs.map((n, idx) => {
                const cfg = TIPO_CONFIG[n.tipo]
                return (
                  <div key={n.id}>
                    <div className="hce-hceheader-notif-row" style={{
                      display:         "flex",
                      gap:             12,
                      padding:         "12px 16px",
                      alignItems:      "flex-start",
                      backgroundColor: hceUi.surface,
                      cursor:          "default",
                      boxSizing:       "border-box",
                    }}>
                      <div style={{ marginTop: "2px", flexShrink: 0 }}>
                        <cfg.Icon color={cfg.color} size={18} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: hceTypography.fontFamily,
                          fontSize:   "0.8rem",
                          fontWeight: 700,
                          color:      hceColors.neutro.black[400],
                          lineHeight: 1.3,
                        }}>
                          {n.titulo}
                        </div>
                        <div style={{
                          fontFamily: hceTypography.fontFamily,
                          fontSize:   "0.75rem",
                          color:      hceUi.textSecondary,
                          marginTop:  "2px",
                          lineHeight: 1.4,
                        }}>
                          {n.descripcion}
                        </div>
                        {n.fecha && (
                          <div style={{
                            fontFamily: hceTypography.fontFamily,
                            fontSize:   "0.68rem",
                            color:      hceUi.textSubtle,
                            marginTop:  "4px",
                            opacity:    0.8,
                          }}>
                            {n.fecha}
                          </div>
                        )}
                      </div>
                    </div>
                    {idx < notifs.length - 1 && <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.12)" }} />}
                  </div>
                )
              })
            )}
          </div>

          <div style={{
            padding:         "8px 16px",
            borderTop:       `1px solid ${"var(--ds-color-primary-light, #e5e7eb)"}`,
            backgroundColor: hceUi.background,
          }}>
            <div
              className="hce-hceheader-notif-footer"
              onClick={() => { handleNotifClose(); onVerTodas?.() }}
              style={{
                fontFamily: hceTypography.fontFamily,
                fontSize:   "0.75rem",
                color:      "var(--ds-color-interactive, #0043a5)",
                textAlign:  "center",
                cursor:     "pointer",
                fontWeight: 600,
              }}
            >
              Ver todas las notificaciones
            </div>
          </div>
        </Menu> */}

        {/* Avatar + nombre */}
       {!isTvVariant  && (
          <button
            ref={userTriggerRef}
            type="button"
            className="hce-hceheader-user-trigger"
            onClick={() => setUserOpen(o => !o)}
            data-testid={testId ? `${testId}-user-menu` : undefined}
          >
            <span style={{
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              width:           34,
              height:          34,
              borderRadius:    "50%",
              backgroundColor: "rgba(255,255,255,0.25)",
              fontSize:        "0.75rem",
              fontWeight:      700,
              color:           "white",
              flexShrink:      0,
              overflow:        "hidden",
              fontFamily:      hceTypography.fontFamily,
            }}>
              {userPhotoUrl ? <img src={userPhotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
            </span>

            <span className="hce-hceheader-user-info" style={{ minWidth: 0, maxWidth: 220 }}>
              <span style={{
                display: "block",
                fontFamily:   hceTypography.fontFamily,
                color:        "white",
                fontWeight:   700,
                fontSize:     "0.82rem",
                lineHeight:   1.2,
                overflow:     "hidden",
                textOverflow: "ellipsis",
                whiteSpace:   "nowrap",
              }}>
                {userName}
              </span>
              {userRole && (
                <span style={{
                  display: "block",
                  fontFamily:   hceTypography.fontFamily,
                  color:        "rgba(255,255,255,0.75)",
                  fontSize:     "0.7rem",
                  lineHeight:   1.2,
                  overflow:     "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace:   "nowrap",
                }}>
                  {userRole}
                </span>
              )}
            </span>

            <ChevronDownGlyph color="rgba(255,255,255,0.8)" />
          </button>
        )}

        {/* Menú usuario */}
        <Menu
          open={userOpen}
          onClose={handleUserClose}
          anchorRef={userTriggerRef}
          align="right"
          aria-label="Menú de usuario"
          panelStyle={{
            minWidth:     180,
            boxShadow:    hceShadows.float,
            borderRadius: "10px",
          }}
        >
          <button
            type="button"
            className="hce-menu-item"
            onClick={handleLogout}
            data-testid={testId ? `${testId}-logout` : undefined}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px" }}
          >
            <LogoutIcon color={hceColors.alert.error[500]} size={14} />
            <span style={{
              fontFamily: hceTypography.fontFamily,
              fontSize:   "0.85rem",
              color:      hceColors.alert.error[500],
              fontWeight: 500,
            }}>
              {labelCloseSesion}
            </span>
          </button>
        </Menu>
      </div>
    </header>
  )
}
