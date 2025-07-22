import { Button, Select, Spin, Table, Typography, message } from "antd";
import axios from "axios";
import React, { useState } from "react";

const { Option } = Select;
const { Title } = Typography;

const API_URL = "http://localhost:8000/api/data/points";

const months = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const years = [2022, 2023, 2024, 2025];

export default function KpiDashboard() {
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    let url = API_URL + "?";
    if (year) url += `year=${year}&`;
    if (month) url += `month=${month}`;
    try {
      const res = await axios.get(url);
      setData(res.data || []);
      if (res.data.count !== undefined) {
        message.success(`Registros encontrados: ${res.data.count}`);
      }
    } catch (err) {
      message.error("Error al obtener datos");
    }
    setLoading(false);
  };

  const columns = [
    { title: "KPI", dataIndex: "kpi_name", key: "kpi_name" },
    { title: "Valor", dataIndex: "value", key: "value" },
    { title: "Fecha", dataIndex: "label", key: "label" },
    { title: "Timestamp", dataIndex: "timestamp", key: "timestamp" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Filtrar KPI por Año y Mes</Title>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Año"
          style={{ width: 120, marginRight: 8 }}
          onChange={setYear}
          allowClear
        >
          {years.map((y) => (
            <Option key={y} value={y}>{y}</Option>
          ))}
        </Select>
        <Select
          placeholder="Mes"
          style={{ width: 150, marginRight: 8 }}
          onChange={setMonth}
          allowClear
        >
          {months.map((m) => (
            <Option key={m.value} value={m.value}>{m.label}</Option>
          ))}
        </Select>
        <Button type="primary" onClick={fetchData}>Filtrar</Button>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(row) => row.id + row.kpi_name}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
} 