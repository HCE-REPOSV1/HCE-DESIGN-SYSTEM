# Changelog

Todos los cambios notables de `@hce/design-system` se documentan en este archivo.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).
Versionado basado en [Semantic Versioning](https://semver.org/).

---

## [1.10.0] - 2026-09-10

### Agregado
- **`HceHeader`**: nuevas props `sedeDisabled`/`sedeDisabledTooltip` — permiten deshabilitar el selector de sede (ej. mientras hay una atención abierta) mostrando un tooltip explicativo en vez de solo bloquear el control sin contexto.

## [1.5.0] - 2026-08-26

### Agregado
- **`HceLanguageSwitch`**: nuevo molecule — botón + dropdown para elegir el idioma activo (globo + código + `Menu`/`MenuItem` existentes). Componente "tonto": recibe `locales`, `activeLocale` y `onLocaleChange` por props y no depende de i18next/react-i18next, mismo criterio de separación que ya usa el resto del design system con MUI. Pensado para montarse junto a `HceHeader` en el shell/remote consumidor, que resuelve los idiomas soportados y aplica el cambio (ej. vía `useLocaleSwitch()` de `@hce/i18n-core`).

## [1.4.0] - 2026-08-08

### Agregado
- **Theming multiempresa**: se consolidaron las paletas de CSF, Sanna y el fallback `unknown` mediante `companyThemes`, `DSProvider`, `useDsTheme` y `useDsTenant`.
- **Tokens semánticos por empresa**: se incorporaron colores para cabeceras, tablas, filas alternas y prioritarias, hover, interacción, botones interactivos y fondo del ícono de actualización.
- **Identidad visual por tenant**: nuevo registro centralizado `companyBranding` para resolver el logo e isotipo de cada empresa sin condicionales dentro de los componentes.
- **Logos de empresa**: se agregaron variantes completas e isotipos para Sanna y para tenants desconocidos.

### Cambiado
- **`Button`**: los estados `primary`, `secondary`, `outlined`, `ghost`, colores personalizados e íconos ahora respetan la paleta activa; las historias individuales, Playground y Gallery comparten la misma configuración visual.
- **`Checkbox`**: el estado seleccionado utiliza el color `secondary` del tenant activo.
- **`BoxBadge`**: el estado `assigned` utiliza `primaryDark` del tema.
- **`DatePicker`**: usa `HceCalendarIcon`; el ícono, placeholder, borde y estado deshabilitado se ajustan al tema y al estado del campo.
- **Componentes temáticos**: `ActionBar`, `ActionIconButton`, `BedsAvailabilityTab`, `BedAvailabilityDrawerV2`, `EmergencyPagination`, `GenericCell`, `GenericTable`, `HCEQuickAccess`, `HceUpdateBanner`, `MonitorActionBar`, `SectionHeader`, `HceModal`, `HceFormModal`, `InfoButton`, `Footer` y `NavTab` consumen variables semánticas del tenant activo.
- **`HceHeader` y `HceSidebar`**: el color institucional y la identidad visual se resuelven dinámicamente mediante el tema; agregar una empresa nueva ya no requiere modificar estos componentes.
- **`DataCardModal`**: se ajustó la presentación del modal para mantenerlo centrado en pantalla.

### Corregido
- **`Tooltip`**: se renderiza sobre los demás elementos, conserva su posición superior respecto al ícono y recalcula correctamente su ubicación durante el scroll.
- **Storybook**: se corrigieron diferencias de color entre historias independientes, Playground y galerías al cambiar de tenant o variante.
- **Cabeceras y textos**: se eliminaron colores institucionales fijos en tablas y componentes clínicos que provocaban tonos azules bajo el tema Sanna.

### Breaking changes
- Ninguno. Los cambios mantienen las APIs públicas existentes y agregan soporte temático de forma compatible.

---

## [1.3.6] - 2026-08-05

### Agregado
- **`Box`** (Átomo): reemplazo propio de `Box` de MUI, en CSS/HTML puro — `component` polimórfico, `forwardRef`, escape-hatch `sx`.
- **`Grid`** (Átomo): reemplazo propio de `Grid` de MUI (API unificada v2: `size`, `offset`, `columns`, `columnSpacing`, `rowSpacing`, `direction`, `wrap`, todos con soporte responsivo por breakpoint).
- **`FormControl`** (Átomo): reemplazo propio de `FormControl` de MUI, con contexto compartido (`useFormControl`) para `disabled`/`error`/`focused`/`required`/`filled` consumible por componentes hijos.
- **`MenuItem`** (Átomo): reemplazo propio de `MenuItem` de MUI, con polyfill de `:focus-visible` y soporte de `value` para uso como opción dentro de `Select`.
- **`Select`** (Átomo): reemplazo propio de `Select` de MUI — genérico (`Select<T>`), soporta `multiple`, `native`, apertura/cierre controlado o no controlado, navegación por teclado.
- **`SelectChangeEvent`**: nuevo tipo público, compatible con la firma de evento de MUI (`event.target.value`).
- **`Avatar`** (Átomo): reemplazo propio de `Avatar` de MUI, con fallback en cascada `src` → `children` → ícono por defecto, detectado vía precarga de imagen.
- **`Avatar.stories.tsx`**: nuevas historias de Storybook para `Avatar` (imagen, iniciales, fallback por imagen rota, variantes de forma, tamaños, grupo superpuesto).
- **`useMediaQuery`** (hook): reemplazo propio de `useMediaQuery` de MUI, implementado con `useSyncExternalStore`, sin dependencia de `ThemeProvider` — `query` acepta solo `string` a propósito.
- **`utils/breakpoints.ts`**: nuevo módulo compartido con `useCurrentBreakpoint` y `resolveResponsiveValue`, usado por `Grid`, `sx` y cualquier componente con props responsivos.
- **`utils/sx.ts`**: nuevo motor `sx` propio (`sxToStyle`, `mergeSx`, tipo `SxProps`) — soporta shorthand de espaciado (`p`, `m`, `px`, `py`, `pt`, `pb`, `pl`, `pr`, `mx`, `my`, `mt`, `mb`, `ml`, `mr`) y valores responsivos por breakpoint en cualquier propiedad CSS (ej. `px: { xs: 2, sm: 4 }`).

### Cambiado
- **`Box`**: prop `sx` retipado de `Record<string, unknown>` a `SxProps` — habilita autocomplete en VS Code y soporte de valores responsivos.
- **`Button`** (Átomo): `sx` retipado a `SxProps` y ahora pasa por `sxToStyle` (antes se mezclaba directo en `style`, por lo que el shorthand de espaciado —`px`, `py`, etc.— quedaba sin efecto); se agregó padding por defecto para el tamaño `"md"` (`12px` vertical / `30px` horizontal).
- **`Typography`** (Átomo): se agregaron los props `align`, `paragraph` (deprecado, por compatibilidad con MUI), `variantMapping` y `classes` para paridad completa con el API oficial; se separó el mapeo variant→tag HTML (`variantMapping`) de la tabla de estilos por variant.
- **`IconButton`** (Molécula): se agregó soporte de `sx`, `style` y `className`; el ícono ahora se auto-dimensiona según el `size` del botón (o `iconSize` explícito) vía `cloneElement`, en vez de depender de `fontSize` (que no tenía efecto sobre íconos SVG propios).
- **`SearchComboInput`** (Molécula): se corrigió `modePosition` para que reordene físicamente el bloque del toggle de modo y el input según `"left"`/`"right"` (antes solo cambiaba el `border-radius` del botón, que quedaba siempre primero en el DOM); se ajustaron los bordes para evitar grosor duplicado en el punto de unión entre el botón y el input.

### Breaking changes
- Ninguno en esta versión — todos los componentes nuevos (`Box`, `Grid`, `FormControl`, `MenuItem`, `Select`, `Avatar`) reemplazan imports directos de `@mui/material` manteniendo la misma API pública consumida por el repo; los cambios en `Button`/`Typography`/`IconButton` son aditivos (nuevos props opcionales, sin remover ninguno existente).

---
---

## [1.3.0] - 2026-07-06

### Agregado
- **`GenericTable`** (Organismo): nueva tabla genérica reutilizable para renderizar columnas configurables por tipo.
- **`GenericRow`** (Molécula): nueva fila genérica usada internamente por `GenericTable`.
- **`GenericCell`** (Molécula): nueva celda genérica con soporte para distintos tipos de columna: `text`, `priority`, `box`, `patient-name`, `clinical-status`, `attention-code`, `info-button`, `waiting-time`, `icon`, `switch` y `tag`.
- **`GenericTableColumn`**: nuevo tipo público para configurar columnas de `GenericTable`.
- **`HceBreadcrumb`** (Átomo): nuevo componente de breadcrumb para mostrar la ruta de navegación dentro de las pantallas HCE.
- **`HceBreadcrumbItem`** y **`HceBreadcrumbProps`**: nuevos tipos públicos para configurar `HceBreadcrumb`.
- **`HceHeader`** (Organismo): nueva prop `title`  .
- **`WaitingBadge`** (Átomo): nuevo badge para mostrar tiempos de espera ya formateados, con soporte para colores semáforo.
- **`getSemaphoreColors`**: helper interno para centralizar los colores semáforo usados por badges clínicos.

### Cambiado
- **Tablas clínicas de emergencia**: se reemplazó la implementación basada en componentes específicos de paciente por una estructura genérica basada en `GenericTable`, `GenericRow` y `GenericCell`.
- **`BoxBadge`** (Átomo): refactor de lógica de colores para usar `getSemaphoreColors` en estados semáforo.
- **`AttentionCode`** (Átomo): se agregó un atributo para permitir mostrar el texto con mayor peso visual.
- **`MonitoActionBar`** (Molécula): se ajustaron estilos visuales para alinearse con el diseño de Figma, sin cambios en su API pública.
- **`EmergencyPagination`** (Molécula): se reemplazó la prop `totalItems` por `summary`, permitiendo mostrar totales agrupados.
- **`hceClinicalColors`**: `rowPriority` ahora reutiliza `hceColors.alert.error[100]`.
- **`hceClinicalColors`**: `rowAlternate` ahora es equivalente a `#F4F7FB`.
- **`HceHeader`** (Organismo): nueva prop `variant` con soporte para `"default"` y `"tv"`, permitiendo separar explícitamente el modo de pantalla pública/TV del header estándar.
- **`src/index.ts`**: se exportan los tipos públicos `HceBreadcrumbItem` y `HceBreadcrumbProps`.
- **`MultiSelectField`** (Atomo): Modificacion del disable para los checkbox y precarga de checks cuando existe data a través del value.
- **`TextareaField`** (Atomo): Modificacion de disabled
- **`NumericField`** (Atomo): Modificacion de disabled


### Breaking changes
- **`BoxBadge`**: la API anterior basada en `status` fue reemplazada por `stage`, `label` y `color`.
- **`EmergencyPagination`**: la prop `totalItems: number` fue reemplazada por `summary: SummaryContent[]`.
- Se eliminaron componentes legacy: **`PatientRow`**, **`PatientTable`**

---

## [1.2.1] - 2026-06-16

### Agregado
- **`MultiSelect`** (Atomo): Dropwodn multiseleccionable con búsqueda.Props `label`, `value`, `onChange`, `options`, `placeholder`, `fullWidth`, `disabled`, `required`, `error`.
  - Incorporación de checkbox en las opciones mostradas.
  - Las opciones con checks seleccionados, se muestran primero en fila
  - Incorporación de búsqueda en el Input Multiselect.
- **`RadioGroup`** (Molécula): Grupo de radioButton. Props `name`, `legend`, `value`, `onChange`, `options`, `disabled`. Funciona seleccionando solo una opción por grupo.
  - Personalización de color y tamaño de letra.
- **`NavTab`** (Organismo): Grupo de Navegadores. Props `tabs`, `value`, `onChange`.
  - Personalización de estilos con **`MuiTab`**.
  - Bordes superiores redondeados
### Cambiado
- **`Checkbox`** (Atomo): Incorporación de color de check y fondo del recuadro. Modificación de estilos
- **`SearchComboInput`** (Molécula): Modificación de interfaz SearchMode . Se cambio "nombre", "cie10" por "cie_description", "cie_code"
---

## [1.2.0] - 2026-04-20

### Agregado

- **`EvaScale`** (Molécula): escala visual analógica del dolor (0-10). Props: `value`, `onChange`, `readOnly`. 11 círculos interactivos con colores progresivos (azul→verde→naranja→rojo), track verde, labels de intensidad y resumen del valor seleccionado
- **`TriagePriorityDisplay`** (Molécula): badges de clasificación de triaje I/II/III/IV con colores institucionales. Props: `selected`, `onSelect`, `readOnly`. Funciona como display o como selector interactivo
- **`SearchComboInput`** (Molécula): input de búsqueda con toggle de modo (Por nombre / CIE-10). Props: `searchMode`, `onSearchModeChange`, `value`, `onChange`, `options`, `onSearch`, `onSelect`, `loading`, `disabled`, `debounceMs`. El padre provee las `options` tras llamar a la API; el componente dispara `onSearch(query, mode)` con debounce configurable. Navegación por teclado (↑↓ Enter Escape) y cierre al click fuera

### Exportaciones nuevas
```ts
EvaScale, EvaScaleProps
TriagePriorityDisplay, TriagePriorityDisplayProps, TriagePriority
SearchComboInput, SearchComboInputProps, SearchMode, SearchOption
```

---

## [1.1.0] - 2026-04-18

### Agregado

- **Tokens `hceTransition`** (`hce.tokens.ts`): constantes de timing para transiciones — `fast` (150ms), `base` (220ms), `slow` (350ms), `width`. Usar en lugar de valores hardcodeados `"0.3s ease"`
- **Tokens `hceShadows`** (`hce.tokens.ts`): sombras con tinte azul de marca — `card`, `sidebar`, `float`, `modal`. Reemplazan `rgba(0,0,0,*)` por `rgba(0,29,69,*)`
- **Tokens `hceUi`** (`hce.tokens.ts`): aliases semánticos de texto y superficie — `textPrimary`, `textSecondary`, `textSubtle`, `surface`, `background`
- **`SkeletonLoader`** (Átomo): nuevo componente de carga esqueleto. Props: `variant` (`text` | `rect` | `circle`), `width`, `height`, `lines` (para text multilinea). Animación shimmer con paleta HCE. Story completa con Default, AllVariants, States, TextMultiline y Circle

### Cambiado

- **`CarruselHome`** — animación de slide con dirección: la imagen saliente se desliza fuera del frame y la entrante entra desde el lado opuesto (derecha al avanzar, izquierda al retroceder). Reemplaza el anterior fade de opacidad
  - **Nueva prop `objectFit?: "contain" | "cover"`** (default: `"contain"`)
  - Pausa en hover: el auto-play se suspende cuando el mouse está sobre el carrusel
  - Swipe táctil: deslizar >40px activa prev/next (esencial para tablets clínicas)
  - Navegación por teclado: `ArrowLeft` / `ArrowRight`
  - Accesibilidad: `role="region"`, `aria-label` en flechas, `role="tab"` + `aria-selected` en dots, `focus-visible`
  - Micro-animación en flechas: `scale(1.1)` en hover

- **`CSFLoading`** — animaciones de entrada para las piezas del logo:
  - Pieza azul cae desde arriba (`translateY(-18px) → 0`) al aparecer en F02
  - Pieza blanca sube desde abajo (`translateY(18px) → 0`) al aparecer en F03
  - Transición basada en estado (se dispara una sola vez, no se reinicia al cambiar `frameDuration`)
  - **`frameDuration` default cambiado de 80ms a 100ms** — la secuencia de intro es ~25% más lenta
  - `animDur = Math.min(frameDuration × 4, 1000ms)` — proporcional con tope para no solapar el sweep

- **`HceModal`** — animación de entrada `slideUp` (opacity + translateY + scale) en 200ms con `Fade` de MUI. Sombra migrada a `hceShadows.modal`. Agregado `aria-labelledby` y `aria-describedby`

- **`HceSidebar`** — mejoras de animación y accesibilidad:
  - Fade de labels al colapsar (`opacity + translateX`)
  - Hover con `translateX(2px)` en items
  - Borde izquierdo de acento (`3px solid blue[600]`) en item activo de todos los niveles
  - `role="button"`, `tabIndex`, `aria-label`, `aria-current`, `aria-expanded`, `onKeyDown` (Enter/Space), `focus-visible` en todos los elementos interactivos

- **`Button`** — micro-interacciones: hover `translateY(-1px)` + sombra elevada, active `scale(0.97)`

- **`TextInput` / `SelectField` / `PasswordInput`** — focus ring animado (`0 0 0 3px blue[100]`), transiciones con `hceTransition.fast`

- **`HceHeader`** (organismo) — `TIPO_CONFIG` migrado de colores hardcodeados a `hceColors.alert.*`. Sombras → `hceShadows`

- **`theme.ts`** — eliminada toda dependencia de `baseColors`. Migrado a `hceColors` + `hceUi`

### Corregido

- **`HceSidebar`** — colores de texto hardcodeados (`"#333"`, `"#444"`, `"#666"`) reemplazados por `hceColors.neutro.*`
- **`HceModal`** — colores migrados de `baseColors.primary` (`#1E4FA3`) a `hceColors.primary.blue[500]` (`#0043a5`), eliminando inconsistencia visual con el sidebar
- **`SideNav.css` / `SidebarMenu.css`** — hex literales reemplazados por variables CSS de `injectHceTokens()`
- **`CarruselHome`** — guard añadido para no aceptar nueva navegación mientras hay animación en curso

### Exportaciones nuevas
```ts
// Tokens
hceTransition
hceShadows
hceUi

// Átomos
SkeletonLoader
SkeletonLoaderProps
SkeletonVariant
```

---

## [1.0.20] - 2026-04-16

### Agregado

- **`HceHeader`** (Organismo): nuevo header institucional con soporte para selección de sede, notificaciones, menú de usuario y modo flotante. Props: `sede`, `sucursales`, `onSedeCambiada`, `userName`, `userRole`, `onLogout`, `notifications?`, `onVerTodas?`, `floating?`, `onMenuClick?`
  - Panel de notificaciones con iconos por tipo (`info`, `warning`, `success`, `error`), marca como leídas al abrir, contador de no leídas en la campana y footer "Ver todas las notificaciones"
  - Prop `floating`: aplica `borderRadius` + `boxShadow` para alinearse visualmente con el `HceSidebar` flotante
  - Prop `onMenuClick`: muestra botón hamburguesa (`HceBurgerIcon`) en pantallas pequeñas (< 900px) para abrir el sidebar como overlay. El texto "Historia Clínica" se oculta en móvil
- **`HceSidebar`** (Organismo): sidebar de navegación basado en opciones MAC
  - Prop `floating`: esquinas redondeadas + sombra sin romper el flujo del documento
  - Submenús con árbol visual tipo rama (`|─`) y fondo persistente cuando hay hijo activo o está expandido
  - Modo colapsado: muestra `UiIsotipoClinicaIcon`, click en cualquier zona del sidebar lo expande; `e.stopPropagation()` en botones para evitar doble-toggle
  - `ICON_REGISTRY` para resolver el campo `icono` de MAC a componente React
- **`HceBurgerIcon`**: nuevo ícono SVG de hamburguesa (3 líneas horizontales), equivalente al `MenuIcon` de MUI. Agregado en `SvgIconsHce.tsx`
- **`HceStarIcon`**: ícono de estrella (outline, stroke), para favoritos / calificación
- **`HceConfigIcon`**: ícono de engranaje (fill), para configuración
- **`Footer` — prop `color`**: permite sobreescribir el color de fondo. Ej: `hceColors.primary.blue[600]`
- **`CarruselHome`**: carrusel con autoplay, flechas de navegación y dots. Prop `images: string[]` recibe las URLs; `objectFit: "contain"` para mostrar la imagen completa sin recorte

### Exportaciones nuevas
```ts
HceHeader
HceHeaderProps
HceNotificacion
Sucursal
HceSidebar
HceSidebarProps
OpcionMAC
HceBurgerIcon
HceStarIcon
HceConfigIcon
CarruselHome
CarruselHomeProps
```

### Corregido

- **`HceHeader`**: importación incorrecta de íconos de notificación (`../../../src/...` → `../../atoms/Icon/SvgIcons`)
- **`HceSidebar`**: doble-toggle al hacer click en el isotipo cuando el sidebar estaba colapsado (se resolvió con `e.stopPropagation()`)
- **`HceSidebar`**: en modo flotante el sidebar pisaba el footer al ocupar `height: 100vh` con `position: fixed`. Se eliminó el posicionamiento fijo — el padre maneja el espacio vía padding/gap
- **`CarruselHome`**: `objectFit` cambiado de `"cover"` a `"contain"` para mostrar las imágenes sin recorte
- **`HceMenuIcon`** ya existía en `SvgIconsHce.tsx` pero no estaba exportado desde `index.ts`

---

## [1.0.11] - 2026-04-14

### Agregado
- **`CSFLoading`** (Molécula): spinner animado con el logo CSF (Clínica San Felipe). Reproduce una secuencia de 11 frames de intro (build-up + barrido del sector DEF4C5) y luego gira el logo completo indefinidamente con `animateTransform` SVG nativo. Props: `open`, `message?`, `size?` (default 150px), `duration?` (seg/vuelta, default 1.5), `frameDuration?` (ms/frame del intro, default 80), `overlay?`, `opacity?`, `children?`
- Story `Molecules/CSFLoading` con galería de 16 frames Figma, controles de tamaño, velocidad de spin y velocidad del intro (`frameDuration`)

### Cambiado
- **Tipografía Poppins explícita en todos los componentes**: se agregó `fontFamily: hceTypography.fontFamily` a todos los `Typography` de los componentes del design system (`LoadingOverlay`, `PageHeader`, `Card`, `DataTable`, `Header`, `Footer`, `SelectField`, `TextInput`, `CSFLoading`). Garantiza Poppins en contextos de Module Federation donde el tema MUI global no se hereda

### Exportaciones nuevas
```ts
CSFLoading
CSFLoadingProps
```

---

## [1.0.10] - 2026-04-07

### Corregido
- **TextInput — color de texto escrito**: Chrome usa `-webkit-text-fill-color` con mayor prioridad que `color`. Se corrigió seteando `WebkitTextFillColor` vía selector `& .MuiInputBase-input`, resolviendo que el texto dentro del input no adoptaba el color activo

### Agregado
- **`SelectField` — prop `disabled`**: permite mostrar el select como solo lectura (pre-seleccionado e ininteractuable)

---

## [1.0.9] - 2026-04-07

### Agregado
- **Prop `error` en `TextInput`**: cuando `error={true}` todos los elementos del input (label, borde, ícono, placeholder y texto escrito) cambian a `hceColors.alert.error[600]`. El estado se mantiene independientemente del hover/focus
- **Prop `error` en `PasswordInput`**: misma lógica que `TextInput`; el ícono eye también adopta el color de error
- **Prop `error` en `SelectField`**: label, borde y texto del select cambian a rojo en estado de error

### Corregido
- **`TextInput` — color de texto escrito**: añadido `"& .MuiInputBase-input": { color, WebkitTextFillColor }` para que el texto escrito adopte el `inputTextColor` al hacer hover/focus (antes permanecía negro)
- **`PasswordInput` — color del texto al mostrar contraseña**: al mantener presionado el ícono eye, el texto ahora hereda el color activo del input en lugar de mostrarse en negro

---

## [1.0.8] - 2026-04-07

### Cambiado
- **`TextInput` — color activo**: el color de hover/focus cambia de `baseColors.primary` (`#1E4FA3`) a `hceColors.primary.blue[600]` (`#003d96`). Afecta label, placeholder, ícono start y borde
- **`SelectField` — color activo**: mismo cambio de color que `TextInput`
- **`PasswordInput` — reescritura completa**:
  - Reemplazados los íconos MUI `VisibilityOutlined`/`VisibilityOffOutlined` por `UiEyeIcon` (siempre el mismo ícono, sin alternar)
  - Comportamiento cambiado de toggle a **mantener presionado para ver**: `onMouseDown` muestra la contraseña, `onMouseUp`/`onMouseLeave` la oculta. Soporta táctil (`onTouchStart`/`onTouchEnd`)
  - `e.preventDefault()` en mousedown para que el input no pierda el foco al presionar el ícono
  - El color del ícono eye sigue el estado activo (`hceColors.primary.blue[600]` en hover/focus, gris en idle)

---

## [1.0.7] - 2026-04-07

### Agregado
- **Íconos UIKit** (46 íconos): nuevo set importado desde Figma HCE Recursos, expuestos con prefijo `Ui` (`UiArrowIcon`, `UiCalendarIcon`, `UiTrashIcon`, etc.). SVGs en `src/assets/icons/uikit/`, componentes en `SvgIconsUiKit.tsx`
- **Tokens de color HCE** (`hce.tokens.ts`): paleta completa desde Figma — `hceColors.primary.blue/green` (50–900), `hceColors.alert.error/info/warning/success` (50–900), `hceColors.neutro.white/black` (50–900)
- **Tipografía Poppins**: `hceTypography.fontFamily` + `injectHceFonts()` para cargar la fuente desde Google Fonts dinámicamente
- **`LoadingOverlay`** (Molécula): overlay fullscreen con backdrop oscuro y spinner. Props: `open`, `message?`, `color?` (default `hceColors.primary.blue[600]`), `opacity?`, `children?`
- **`HceModal`** (Organismo): modal/dialog configurable al estilo SweetAlert. Soporta: ícono badge opcional, título, descripción, `TextInput` opcional, botón confirmar (verde/filled) y cancelar (outlined azul), ambos independientes. Layout `"row"` o `"column"` para los botones
- Stories de Storybook para `LoadingOverlay` y `HceModal` (galería con 6 variantes visuales)
- Sección **UIKit** en la galería de íconos de Storybook

### Cambiado
- **Tipografía global**: `baseTypography.fontFamily` actualizada de `Montserrat` a `Poppins` — se propaga a todos los componentes MUI vía tema
- **TextInput** y **SelectField**: label, placeholder e ícono cambian al azul corporativo (`#1E4FA3`) en hover/focus
- **Icon story**: galería de Storybook ahora muestra 4 secciones (Lucide / HCE Icon1 Médicos / HCE Icon2 UI / UIKit)

### Exportaciones nuevas
```ts
// Tokens
hceColors, hceTypography, injectHceTokens, injectHceFonts

// Moléculas
LoadingOverlay

// Organismos
HceModal

// UIKit (46 íconos)
UiArrowIcon, UiDoctorIcon, UiCalendarIcon, UiTrashIcon, UiSearchIcon ...
```

---

## [1.0.6] - 2026-03-25

### Agregado
- Componentes de organismos: Header, SideNav, DataTable
- Soporte completo de theming con `emergencyTheme`

### Cambiado
- Mejoras visuales en `Button` y `PriorityBadge`

---

## [1.0.5]

### Agregado
- Molecules: `EmergencyHeader`, `ActionBar`, `PatientRow`, `PatientTable`
- `EmergencyPagination`, `BedsAvailabilityTab`

---

## [1.0.4]

### Agregado
- Tokens de emergencia (`emergency.tokens.ts`)
- `emergencyTheme` para módulo de urgencias

---

## [1.0.3]

### Agregado
- Atoms: `PriorityBadge`, `BoxBadge`, `ClinicalStatusIcon`
- `AttentionCode`, `InfoButton`, `ActionIconButton`

---

## [1.0.2]

### Agregado
- `DSProvider` — ThemeProvider para envolver aplicaciones consumidoras
- Export centralizado en `src/index.ts`

---

## [1.0.1]

### Agregado
- Configuración de Verdaccio y flujo de publicación con Docker
- Storybook con auto-generación de stories (`generate-stories.mjs`)

---

## [1.0.0]

### Agregado
- Setup inicial del proyecto
- Atoms base: `Button`, `TextInput`, `Badge`
- Build en modo librería con Vite (`index.js`, `index.cjs`, `index.d.ts`)
- Tema base MUI (`theme.ts`)
