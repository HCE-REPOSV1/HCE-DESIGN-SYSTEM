import type { Meta, StoryObj } from "@storybook/react"

import { GenericTable } from "../../src/organisms/GenericTable/GenericTable"
import type { GenericTableColumn } from "../../src/molecules/GenericCell/GenericCell"
import type { PriorityLevel } from "../../src/atoms/PriorityBadge/PriorityBadge"
import type { ClinicalIconStatus } from "../../src/molecules/ClinicalStatusIcon/ClinicalStatusIcon"

interface MonitorRow {
  id: string
  priority: PriorityLevel | null
  priority_sort: number | null

  box: {
    label?: string
    stage: "ESPERA" | "SALA_D" | "BOX_ASIGNADO"
    color: "green" | "yellow" | "red" | null
  }

  document_number: string
  document_number_masked: string | null
  patient_name: string
  patient_name_masked: string | null

  age: string
  sex: "M" | "F"

  physician_assigned: boolean
  physician_name_display: string

  lab: ClinicalIconStatus | null
  img: ClinicalIconStatus | null
  indication: ClinicalIconStatus | null
  interconsult: ClinicalIconStatus | null

  attention_id: string | "none"

  waiting_time_box_minutes: string | null
  waiting_time_box_color: "green" | "yellow" | "red" | null
  waiting_time_physician_minutes: string | null
  waiting_time_physician_color: "green" | "yellow" | "red" | null

  attentionDate: string
  attentionHour: string

  dischargeDate: string
  dischargeHour: string
  has_discharge: boolean

  row_alert_color?: "red" | null
  is_vip?: boolean
}

const rows: MonitorRow[] = [
  {
    id: "1",
    priority: 1,
    priority_sort: 1,
    box: {
      label: "TP08",
      stage: "BOX_ASIGNADO",
      color: null,
    },
    document_number: "90123456",
    document_number_masked: "90XXXXXX",
    patient_name: "Sofía González Pérez",
    patient_name_masked: "SoXXXX XXXXXXXX XXXXX",
    age: "29 a",
    sex: "F",
    physician_name_display: "Lucas Antonio Ramírez",
    physician_assigned: true,
    lab: "ok",
    img: "ok",
    indication: "urgent",
    interconsult: "urgent",
    attention_id: "E097382",
    waiting_time_box_minutes: "00:15:00",
    waiting_time_box_color: "green",
    waiting_time_physician_minutes: "00:03:00",
    waiting_time_physician_color: "green",
    attentionDate: "01/01/2024",
    attentionHour: "15:03",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: null,
    is_vip: false,
  },
  {
    id: "2",
    priority: 1,
    priority_sort: 1,
    box: {
      label: "TP12",
      stage: "BOX_ASIGNADO",
      color: null,
    },
    document_number: "87654321",
    document_number_masked: "87XXXXXX",
    patient_name: "Camila Morales Castro",
    patient_name_masked: "CaXXXXX XXXXXXX XXXXXX",
    age: "20 a",
    sex: "F",
    physician_name_display: "Lucas Antonio Ramírez",
    physician_assigned: true,
    lab: "ok",
    img: "urgent",
    indication: "empty",
    interconsult: "ok",
    attention_id: "E097383",
    waiting_time_box_minutes: "00:10:00",
    waiting_time_box_color: "green",
    waiting_time_physician_minutes: "00:02:00",
    waiting_time_physician_color: "green",
    attentionDate: "01/01/2024",
    attentionHour: "14:50",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: null,
    is_vip: false,
  },
  {
    id: "3",
    priority: 2,
    priority_sort: 2,
    box: {
      label: "TP02",
      stage: "BOX_ASIGNADO",
      color: null,
    },
    document_number: "78901234",
    document_number_masked: "78XXXXXX",
    patient_name: "Andrés Castillo Mena",
    patient_name_masked: "AnXXXX XXXXXXXX XXXX",
    age: "47 a",
    sex: "M",
    physician_name_display: "Adulto",
    physician_assigned: false,
    lab: "urgent",
    img: "empty",
    indication: "ok",
    interconsult: "urgent",
    attention_id: "E097384",
    waiting_time_box_minutes: "00:05:30",
    waiting_time_box_color: "green",
    waiting_time_physician_minutes: "00:06:30",
    waiting_time_physician_color: "red",
    attentionDate: "01/01/2024",
    attentionHour: "15:10",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: "red",
    is_vip: false,
  },
  {
    id: "4",
    priority: 2,
    priority_sort: 2,
    box: {
      stage: "SALA_D",
      color: "yellow",
    },
    document_number: "34567890",
    document_number_masked: "34XXXXXX",
    patient_name: "Lucas Martínez Reyes",
    patient_name_masked: "LuXXX XXXXXXXX XXXXX",
    age: "10 d",
    sex: "M",
    physician_name_display: "Pediátrico",
    physician_assigned: false,
    lab: "empty",
    img: "empty",
    indication: "empty",
    interconsult: "empty",
    attention_id: "E097385",
    waiting_time_box_minutes: "00:20:00",
    waiting_time_box_color: "yellow",
    waiting_time_physician_minutes: null,
    waiting_time_physician_color: null,
    attentionDate: "01/01/2024",
    attentionHour: "15:03",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: null,
    is_vip: false,
  },
  {
    id: "5",
    priority: 3,
    priority_sort: 3,
    box: {
      stage: "ESPERA",
      color: null,
    },
    document_number: "45678901",
    document_number_masked: "45XXXXXX",
    patient_name: "Diego Fernández López",
    patient_name_masked: "DiXXX XXXXXXXXX XXXXX",
    age: "23 a",
    sex: "M",
    physician_name_display: "Adulto",
    physician_assigned: false,
    lab: "empty",
    img: "empty",
    indication: "empty",
    interconsult: "empty",
    attention_id: "none",
    waiting_time_box_minutes: null,
    waiting_time_box_color: null,
    waiting_time_physician_minutes: null,
    waiting_time_physician_color: null,
    attentionDate: "-",
    attentionHour: "-",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: null,
    is_vip: false,
  },
  {
    id: "2",
    priority: 1,
    priority_sort: 1,
    box: {
      label: "TP12",
      stage: "BOX_ASIGNADO",
      color: null,
    },
    document_number: "87654321",
    document_number_masked: "87XXXXXX",
    patient_name: "Camila Morales Castro",
    patient_name_masked: "CaXXXXX XXXXXXX XXXXXX",
    age: "20 a",
    sex: "F",
    physician_name_display: "Lucas Antonio Ramírez",
    physician_assigned: true,
    lab: "ok",
    img: "urgent",
    indication: "empty",
    interconsult: "ok",
    attention_id: "E097383",
    waiting_time_box_minutes: "00:10:00",
    waiting_time_box_color: "green",
    waiting_time_physician_minutes: "00:02:00",
    waiting_time_physician_color: "green",
    attentionDate: "01/01/2024",
    attentionHour: "14:50",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: null,
    is_vip: false,
  },
  {
    id: "3",
    priority: 2,
    priority_sort: 2,
    box: {
      label: "TP02",
      stage: "BOX_ASIGNADO",
      color: null,
    },
    document_number: "78901234",
    document_number_masked: "78XXXXXX",
    patient_name: "Andrés Castillo Mena",
    patient_name_masked: "AnXXXX XXXXXXXX XXXX",
    age: "47 a",
    sex: "M",
    physician_name_display: "Adulto",
    physician_assigned: false,
    lab: "urgent",
    img: "empty",
    indication: "ok",
    interconsult: "urgent",
    attention_id: "E097384",
    waiting_time_box_minutes: "00:05:30",
    waiting_time_box_color: "green",
    waiting_time_physician_minutes: "00:06:30",
    waiting_time_physician_color: "red",
    attentionDate: "01/01/2024",
    attentionHour: "15:10",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: "red",
    is_vip: false,
  },
  {
    id: "4",
    priority: 2,
    priority_sort: 2,
    box: {
      stage: "SALA_D",
      color: "yellow",
    },
    document_number: "34567890",
    document_number_masked: "34XXXXXX",
    patient_name: "Lucas Martínez Reyes",
    patient_name_masked: "LuXXX XXXXXXXX XXXXX",
    age: "10 d",
    sex: "M",
    physician_name_display: "Pediátrico",
    physician_assigned: false,
    lab: "empty",
    img: "empty",
    indication: "empty",
    interconsult: "empty",
    attention_id: "E097385",
    waiting_time_box_minutes: "00:20:00",
    waiting_time_box_color: "yellow",
    waiting_time_physician_minutes: null,
    waiting_time_physician_color: null,
    attentionDate: "01/01/2024",
    attentionHour: "15:03",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: null,
    is_vip: false,
  },
  {
    id: "5",
    priority: 3,
    priority_sort: 3,
    box: {
      stage: "ESPERA",
      color: null,
    },
    document_number: "45678901",
    document_number_masked: "45XXXXXX",
    patient_name: "Diego Fernández López",
    patient_name_masked: "DiXXX XXXXXXXXX XXXXX",
    age: "23 a",
    sex: "M",
    physician_name_display: "Adulto",
    physician_assigned: false,
    lab: "empty",
    img: "empty",
    indication: "empty",
    interconsult: "empty",
    attention_id: "none",
    waiting_time_box_minutes: null,
    waiting_time_box_color: null,
    waiting_time_physician_minutes: null,
    waiting_time_physician_color: null,
    attentionDate: "-",
    attentionHour: "-",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: null,
    is_vip: false,
  },
  {
    id: "2",
    priority: 1,
    priority_sort: 1,
    box: {
      label: "TP12",
      stage: "BOX_ASIGNADO",
      color: null,
    },
    document_number: "87654321",
    document_number_masked: "87XXXXXX",
    patient_name: "Camila Morales Castro",
    patient_name_masked: "CaXXXXX XXXXXXX XXXXXX",
    age: "20 a",
    sex: "F",
    physician_name_display: "Lucas Antonio Ramírez",
    physician_assigned: true,
    lab: "ok",
    img: "urgent",
    indication: "empty",
    interconsult: "ok",
    attention_id: "E097383",
    waiting_time_box_minutes: "00:10:00",
    waiting_time_box_color: "green",
    waiting_time_physician_minutes: "00:02:00",
    waiting_time_physician_color: "green",
    attentionDate: "01/01/2024",
    attentionHour: "14:50",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: null,
    is_vip: false,
  },
  {
    id: "3",
    priority: 2,
    priority_sort: 2,
    box: {
      label: "TP02",
      stage: "BOX_ASIGNADO",
      color: null,
    },
    document_number: "78901234",
    document_number_masked: "78XXXXXX",
    patient_name: "Andrés Castillo Mena",
    patient_name_masked: "AnXXXX XXXXXXXX XXXX",
    age: "47 a",
    sex: "M",
    physician_name_display: "Adulto",
    physician_assigned: false,
    lab: "urgent",
    img: "empty",
    indication: "ok",
    interconsult: "urgent",
    attention_id: "E097384",
    waiting_time_box_minutes: "00:05:30",
    waiting_time_box_color: "green",
    waiting_time_physician_minutes: "00:06:30",
    waiting_time_physician_color: "red",
    attentionDate: "01/01/2024",
    attentionHour: "15:10",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: "red",
    is_vip: false,
  },
  {
    id: "4",
    priority: 2,
    priority_sort: 2,
    box: {
      stage: "SALA_D",
      color: "yellow",
    },
    document_number: "34567890",
    document_number_masked: "34XXXXXX",
    patient_name: "Lucas Martínez Reyes",
    patient_name_masked: "LuXXX XXXXXXXX XXXXX",
    age: "10 d",
    sex: "M",
    physician_name_display: "Pediátrico",
    physician_assigned: false,
    lab: "empty",
    img: "empty",
    indication: "empty",
    interconsult: "empty",
    attention_id: "E097385",
    waiting_time_box_minutes: "00:20:00",
    waiting_time_box_color: "yellow",
    waiting_time_physician_minutes: null,
    waiting_time_physician_color: null,
    attentionDate: "01/01/2024",
    attentionHour: "15:03",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: null,
    is_vip: false,
  },
  {
    id: "5",
    priority: 3,
    priority_sort: 3,
    box: {
      stage: "ESPERA",
      color: null,
    },
    document_number: "45678901",
    document_number_masked: "45XXXXXX",
    patient_name: "Diego Fernández López",
    patient_name_masked: "DiXXX XXXXXXXXX XXXXX",
    age: "23 a",
    sex: "M",
    physician_name_display: "Adulto",
    physician_assigned: false,
    lab: "empty",
    img: "empty",
    indication: "empty",
    interconsult: "empty",
    attention_id: "none",
    waiting_time_box_minutes: null,
    waiting_time_box_color: null,
    waiting_time_physician_minutes: null,
    waiting_time_physician_color: null,
    attentionDate: "-",
    attentionHour: "-",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: null,
    is_vip: false,
  },
  {
    id: "2",
    priority: 1,
    priority_sort: 1,
    box: {
      label: "TP12",
      stage: "BOX_ASIGNADO",
      color: null,
    },
    document_number: "87654321",
    document_number_masked: "87XXXXXX",
    patient_name: "Camila Morales Castro",
    patient_name_masked: "CaXXXXX XXXXXXX XXXXXX",
    age: "20 a",
    sex: "F",
    physician_name_display: "Lucas Antonio Ramírez",
    physician_assigned: true,
    lab: "ok",
    img: "urgent",
    indication: "empty",
    interconsult: "ok",
    attention_id: "E097383",
    waiting_time_box_minutes: "00:10:00",
    waiting_time_box_color: "green",
    waiting_time_physician_minutes: "00:02:00",
    waiting_time_physician_color: "green",
    attentionDate: "01/01/2024",
    attentionHour: "14:50",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: null,
    is_vip: false,
  },
  {
    id: "3",
    priority: 2,
    priority_sort: 2,
    box: {
      label: "TP02",
      stage: "BOX_ASIGNADO",
      color: null,
    },
    document_number: "78901234",
    document_number_masked: "78XXXXXX",
    patient_name: "Andrés Castillo Mena",
    patient_name_masked: "AnXXXX XXXXXXXX XXXX",
    age: "47 a",
    sex: "M",
    physician_name_display: "Adulto",
    physician_assigned: false,
    lab: "urgent",
    img: "empty",
    indication: "ok",
    interconsult: "urgent",
    attention_id: "E097384",
    waiting_time_box_minutes: "00:05:30",
    waiting_time_box_color: "green",
    waiting_time_physician_minutes: "00:06:30",
    waiting_time_physician_color: "red",
    attentionDate: "01/01/2024",
    attentionHour: "15:10",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: "red",
    is_vip: false,
  },
  {
    id: "4",
    priority: 2,
    priority_sort: 2,
    box: {
      stage: "SALA_D",
      color: "yellow",
    },
    document_number: "34567890",
    document_number_masked: "34XXXXXX",
    patient_name: "Lucas Martínez Reyes",
    patient_name_masked: "LuXXX XXXXXXXX XXXXX",
    age: "10 d",
    sex: "M",
    physician_name_display: "Pediátrico",
    physician_assigned: false,
    lab: "empty",
    img: "empty",
    indication: "empty",
    interconsult: "empty",
    attention_id: "E097385",
    waiting_time_box_minutes: "00:20:00",
    waiting_time_box_color: "yellow",
    waiting_time_physician_minutes: null,
    waiting_time_physician_color: null,
    attentionDate: "01/01/2024",
    attentionHour: "15:03",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: null,
    is_vip: false,
  },
  {
    id: "5",
    priority: 3,
    priority_sort: 3,
    box: {
      stage: "ESPERA",
      color: null,
    },
    document_number: "45678901",
    document_number_masked: "45XXXXXX",
    patient_name: "Diego Fernández López",
    patient_name_masked: "DiXXX XXXXXXXXX XXXXX",
    age: "23 a",
    sex: "M",
    physician_name_display: "Adulto",
    physician_assigned: false,
    lab: "empty",
    img: "empty",
    indication: "empty",
    interconsult: "empty",
    attention_id: "none",
    waiting_time_box_minutes: null,
    waiting_time_box_color: null,
    waiting_time_physician_minutes: null,
    waiting_time_physician_color: null,
    attentionDate: "-",
    attentionHour: "-",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: null,
    is_vip: false,
  },
  {
    id: "6",
    priority: 4,
    priority_sort: 4,
    box: {
      label: "TP09",
      stage: "BOX_ASIGNADO",
      color: null,
    },
    document_number: "43248951",
    document_number_masked: "43XXXXXX",
    patient_name: "Selena Miranda",
    patient_name_masked: "SeXXXX XXXXXXX",
    age: "18 a",
    sex: "F",
    physician_name_display: "Henry Vidal Sánchez",
    physician_assigned: true,
    lab: "ok",
    img: "ok",
    indication: "ok",
    interconsult: "ok",
    attention_id: "E097386",
    waiting_time_box_minutes: "00:18:00",
    waiting_time_box_color: "yellow",
    waiting_time_physician_minutes: "00:01:00",
    waiting_time_physician_color: "green",
    attentionDate: "01/01/2024",
    attentionHour: "15:20",
    dischargeDate: "07/01/2024",
    dischargeHour: "10:03",
    has_discharge: true,
    row_alert_color: null,
    is_vip: true,
  },
  {
    id: "7",
    priority: 'none',
    priority_sort: null,
    box: {
      stage: "ESPERA",
      color: null,
    },
    document_number: "11112222",
    document_number_masked: "11XXXXXX",
    patient_name: "Jaime Gutierres",
    patient_name_masked: "JAXXXX XXXXXXXX",
    age: "31 a",
    sex: "F",
    physician_name_display: "Adulto",
    physician_assigned: false,
    lab: "empty",
    img: "empty",
    indication: "empty",
    interconsult: "empty",
    attention_id: "none",
    waiting_time_box_minutes: null,
    waiting_time_box_color: null,
    waiting_time_physician_minutes: null,
    waiting_time_physician_color: null,
    attentionDate: "-",
    attentionHour: "-",
    dischargeDate: "-",
    dischargeHour: "-",
    has_discharge: false,
    row_alert_color: null,
    is_vip: false,
  },
]

const canReadTriage = true
const canEditBox = true
const canReadHce = true
const canReadInfo = true

const monitorDskColumns: GenericTableColumn<MonitorRow>[] = [
  {
    key: "priority",
    header: "Prioridad",
    type: "priority",
    field: "priority",
    width: 100,
    maxWidth: 100,
    align: "center",
    clickable: true,
    disabledGetter: () => !canReadTriage,
    onClick: (row) => {
      console.log("Abrir triaje en modo lectura:", row)
    },
  },
  {
    key: "box",
    header: "Box",
    type: "box",
    field: "box",
    width: 100,
    maxWidth: 170,
    align: "center",
    clickable: true,
    disabledGetter: () => !canEditBox,
    onClick: (row, value) => {
      const box = value as MonitorRow["box"]

      if (box.stage === "ESPERA") {
        console.log(
          "Paciente aún no cuenta con atención. Comunicarse con Counter.",
          row,
        )
        return
      }

      if (box.stage === "SALA_D") {
        console.log("Abrir modal de asignación de box:", row)
        return
      }

      console.log("Abrir modal de cambio de box:", row)
    },
  },
  {
    align: "center",
    key: "document",
    header: "N.Documento",
    type: "text",
    width: 100,
    valueGetter: (row) =>
      row.is_vip ? row.document_number_masked : row.document_number,
    boldGetter: (row) => row.has_discharge,
  },
  {
    key: "patient",
    header: "Paciente",
    type: "patient-name",
    align: "center",
    width: 200,
    clickable: true,
    valueGetter: (row) =>
      row.is_vip ? row.patient_name_masked : row.patient_name,
    disabledGetter: (row) => !canReadHce || !row.physician_assigned,
    boldGetter: (row) => row.has_discharge,
    onClick: (row) => {
      console.log("Abrir HCE:", row)
    },
    cellSx: {
      padding: "0 12px",
    },
  },
  {
    key: "age",
    header: "Edad",
    type: "text",
    field: "age",
    width: 70,
    maxWidth: 70,
    align: "center",
    boldGetter: (row) => row.has_discharge,
  },
  {
    key: "sex",
    header: "Sexo",
    type: "text",
    field: "sex",
    width: 70,
    maxWidth: 70,
    align: "center",
    boldGetter: (row) => row.has_discharge,
  },
  {
    key: "doctor",
    header: "Médico",
    type: "text",
    field: "physician_name_display",
    width: 200,
    boldGetter: (row) => row.has_discharge,
  },
  {
    key: "lab",
    header: "Lab",
    type: "clinical-status",
    field: "lab",
    clinicalIcon: "lab",
    width: 60,
    maxWidth: 60,
    align: "center",
  },
  {
    key: "img",
    header: "Img",
    type: "clinical-status",
    field: "img",
    clinicalIcon: "img",
    width: 60,
    maxWidth: 60,
    align: "center",
  },
  {
    key: "indication",
    header: "Indc. Med.",
    type: "clinical-status",
    field: "indication",
    clinicalIcon: "indication",
    width: 70,
    maxWidth: 70,
    align: "center",
  },
  {
    key: "interconsult",
    header: "Interc.",
    type: "clinical-status",
    field: "interconsult",
    clinicalIcon: "interconsult",
    width: 80,
    maxWidth: 80,
    align: "center",
  },
  {
    key: "attentionCode",
    header: "Atención",
    type: "attention-code",
    field: "attention_id",
    width: 90,
    maxWidth: 90,
     boldGetter: (row) => row.has_discharge,
  },
  {
    key: "info",
    header: "Info",
    type: "info-button",
    tooltip: "Ver información del paciente",
    width: 60,
    maxWidth: 60,
    align: "center",
    clickable: true,
    disabledGetter: (row) => !canReadInfo || row.box.stage === "ESPERA",
    onClick: (row) => {
      console.log("Abrir información adicional:", row)
    },
  },
]

const monitorTvColumns: GenericTableColumn<MonitorRow>[] = [
  {
    key: "priority",
    header: "Prioridad",
    type: "priority",
    field: "priority",
    width: 100,
    maxWidth: 100,
    align: "center",
  },
  {
    key: "box",
    header: "Box",
    type: "box",
    field: "box",
    width: 160,
    maxWidth: 160,
    align: "center",
  },
  {
    key: "patient",
    header: "Paciente",
    type: "patient-name",
    width: 220,
    valueGetter: (row) =>
      row.is_vip
        ? row.patient_name_masked
        : toTvPatientName(row.patient_name),
    cellSx: {
      padding: "0 12px",
    },
  },
  {
    key: "age",
    header: "Edad",
    type: "text",
    field: "age",
    width: 55,
    maxWidth: 55,
    align: "center",
  },
  {
    key: "doctor",
    header: "Médico",
    type: "text",
    field: "physician_name_display",
    width: 220,
  },
  {
    key: "lab",
    header: "Lab",
    type: "clinical-status",
    field: "lab",
    clinicalIcon: "lab",
    width: 60,
    maxWidth: 60,
    align: "center",
  },
  {
    key: "img",
    header: "Img",
    type: "clinical-status",
    field: "img",
    clinicalIcon: "img",
    width: 60,
    maxWidth: 60,
    align: "center",
  },
  {
    key: "indication",
    header: "Indc. Med.",
    type: "clinical-status",
    field: "indication",
    clinicalIcon: "indication",
    width: 60,
    maxWidth: 60,
    align: "center",
  },
  {
    key: "interconsult",
    header: "Interc.",
    type: "clinical-status",
    field: "interconsult",
    clinicalIcon: "interconsult",
    width: 60,
    maxWidth: 60,
    align: "center",
  },
  {
    key: "attentionDate",
    header: "F. atención",
    type: "text",
    field: "attentionDate",
    width: 90,
    maxWidth: 90,
    align: "center",
  },
  {
    key: "attentionHour",
    header: "H. atención",
    type: "text",
    field: "attentionHour",
    width: 90,
    maxWidth: 90,
    align: "center",
  },
  {
    key: "waitingBoxTime",
    header: "T. espera - BOX",
    type: "waiting-time",
    field: "waiting_time_box_minutes",
    colorField: "waiting_time_box_color",
    width: 200,
    maxWidth: 200,
    align: "center",
  },
]

const monitorSortComparator = (a: MonitorRow, b: MonitorRow) => {
  const priorityA = a.priority_sort ?? 99
  const priorityB = b.priority_sort ?? 99

  if (priorityA !== priorityB) {
    return priorityA - priorityB
  }

  const dateTimeA = getDateTimeValue(a.attentionDate, a.attentionHour)
  const dateTimeB = getDateTimeValue(b.attentionDate, b.attentionHour)

  return dateTimeA - dateTimeB
}

const getDateTimeValue = (date?: string, hour?: string) => {
  if (!date || !hour || date === "-" || hour === "-") {
    return Number.MAX_SAFE_INTEGER
  }

  const [day, month, year] = date.split("/")
  const isoDate = `${year}-${month}-${day}T${hour}:00`

  const time = new Date(isoDate).getTime()

  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time
}

const meta: Meta<typeof GenericTable<MonitorRow>> = {
  title: "Organisms/GenericTable",
  component: GenericTable<MonitorRow>,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  // GenericTable llena el alto de su contenedor (height:100%) y depende de
  // que el consumidor le dé una altura acotada real, igual que hace
  // MonitorPage en mf-emergency. El iframe de Storybook NO da eso por
  // defecto (html/body/#storybook-root quedan con alto automático según el
  // contenido, sin overflow:hidden) — sin este decorator, el panel "Canvas"
  // termina scrolleando la página completa en vez de que la tabla scrollee
  // sola por dentro.
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", overflow: "hidden" }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof GenericTable<MonitorRow>>

export const MonitorDsk: Story = {
  args: {
    rows,
    columns: monitorDskColumns,
    getRowId: (row) => row.id,
    maxHeight: "100%",
    rowAlertGetter: (row) => row.row_alert_color === "red",
    sortComparator: monitorSortComparator,
  },
}

export const MonitorTv: Story = {
  args: {
    rows,
    columns: monitorTvColumns,
    getRowId: (row) => row.id,
    maxHeight: "100%",
    rowAlertGetter: (row) => row.row_alert_color === "red",
    sortComparator: monitorSortComparator,
  },
}

export const Empty: Story = {
  args: {
    rows: [],
    columns: monitorDskColumns,
    getRowId: (row) => row.id,
    maxHeight: "100%",
  },
}

export const WithoutMacPermission: Story = {
  args: {
    rows,
    columns: monitorDskColumns.map((column) => {
      if (column.key === "patient") {
        return {
          ...column,
          disabledGetter: () => true,
          onClick: () => {
            console.log("No debería abrir HCE por MAC")
          },
        }
      }

      if (column.key === "box") {
        return {
          ...column,
          disabledGetter: () => true,
          onClick: () => {
            console.log("No debería abrir box por MAC")
          },
        }
      }

      if (column.key === "info") {
        return {
          ...column,
          disabledGetter: () => true,
          onClick: () => {
            console.log("No debería abrir info por MAC")
          },
        }
      }

      return column
    }),
    getRowId: (row) => row.id,
    maxHeight: "100%",
    rowAlertGetter: (row) => row.row_alert_color === "red",
    sortComparator: monitorSortComparator,
  },
}

function toTvPatientName(fullName: string) {
  const parts = fullName.trim().split(/\s+/)

  if (parts.length === 0) return "-"

  const firstName = parts[0]
  const firstLastNameInitial = parts[1]?.[0]

  if (!firstLastNameInitial) return firstName

  return `${firstName} ${firstLastNameInitial}.`
}