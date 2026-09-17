import type { Meta, StoryObj } from "@storybook/react";
import { MultiSelect } from "@hce/design-system";
import { useState } from "react";
const APIRESPONSE = [
  {id: "1"}
]
const EMPRESAS = [
  { value: "1", label: "Sede Central" },
  { value: "2", label: "Sede Norte" },
  { value: "3", label: "Sede Sur" },
];

const EMPRESAS_LABELS_LARGOS = [
  {
    value: "CENTRAL",
    label: "Sede Central - Av. Javier Prado Este 123, San Isidro, Lima",
  },
  { value: "NORTE", label: "Sede Norte" },
  {
    value: "SUR",
    label: "Sede Sur - Complejo Hospitalario Regional del Sur",
  },
];

const meta: Meta<typeof MultiSelect> = {
  title: "Atoms/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return <MultiSelect {...args} value={value} onChange={setValue} />;
  },
  args: {
    options: EMPRESAS,
    label: "Empresas",
    disabled: false,
    fullWidth: true,
    required: false,
  },
};

/**
 * Cubre el caso donde el label de una opción es más largo que el ancho del
 * trigger: el panel desplegable debe mantener el ancho del trigger (no
 * ensancharse) y el texto debe truncarse con ellipsis en vez de superponerse
 * al checkbox.
 */
export const LongLabels: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return <MultiSelect {...args} value={value} onChange={setValue} />;
  },
  args: {
    options: EMPRESAS_LABELS_LARGOS,
    label: "Empresas",
    disabled: false,
    fullWidth: true,
    required: false,
  },
};


export const ChecksSeleccionados: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(["1"]);
    return <MultiSelect {...args} value={value} onChange={setValue} />;
  },
  args: {
    options: EMPRESAS,
    label: "Empresas",
    disabled: false,
    fullWidth: true,
    required: false,
  },
};

/**
 * Bug fix: los elementos ya seleccionados deben seguir visibles y anclados
 * arriba de la lista aunque el usuario escriba una búsqueda que no matchea
 * su label — antes desaparecían del listbox en cuanto el texto tecleado no
 * incluía su nombre, perdiendo visibilidad de la selección previa.
 *
 * Para reproducir manualmente en Storybook: abrir el dropdown (ya viene con
 * "Sede Central" preseleccionada) y escribir "norte" — "Sede Central" debe
 * seguir apareciendo anclada arriba, con el checkbox marcado, junto al
 * resultado que sí matchea la búsqueda ("Sede Norte").
 */
export const SeleccionadoPersisteAlBuscar: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(["1"]);
    return <MultiSelect {...args} value={value} onChange={setValue} />;
  },
  args: {
    options: EMPRESAS,
    label: "Empresas",
    disabled: false,
    fullWidth: true,
    required: false,
  },
};

/**
 * disabled=true ya NO bloquea la apertura del dropdown (a diferencia del
 * comportamiento anterior, que usaba el `disabled` nativo de Autocomplete):
 * el panel se puede abrir e inspeccionar, pero cada opción queda inerte
 * (pointer-events: none, cursor: not-allowed) y no se puede cambiar la
 * selección. Ver commit 0a9d6ac "fix: correccion de disable en componentes
 * y multiselectchebox".
 */
export const Disabled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(["1"]);
    return <MultiSelect {...args} value={value} onChange={setValue} />;
  },
  args: {
    options: EMPRESAS,
    label: "Empresas",
    disabled: true,
    fullWidth: true,
    required: false,
  },
};