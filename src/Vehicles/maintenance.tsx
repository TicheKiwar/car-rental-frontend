import React, { useEffect, useState } from 'react';
import { Card, Button, Checkbox, Form, message, Input, Menu, Divider, Modal, Row, Col, Pagination } from 'antd';
import { getMaintenances, updateMaintenance } from '../services/maintenance.service';
import { IMaintenance } from '../types/Maintenances';
import { IVehicleStatus } from '../types/VehicleStatus';
import VehicleInfoModal from './VehicleInfo.modal';

const MaintenancePage: React.FC = () => {
    const [maintenances, setMaintenances] = useState<IMaintenance[]>([]);
    const [selectedMaintenance, setSelectedMaintenance] = useState<IMaintenance | null>(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'pending' | 'completed'>('pending');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchMaintenances();
    }, [filter]);

    const fetchMaintenances = async () => {
        try {
            const data = await getMaintenances();
            if (filter === 'pending') {
                setMaintenances(data.filter(maintenance => maintenance.status !== 'Completado'));
            } else {
                setMaintenances(data.filter(maintenance => maintenance.status === 'Completado'));
            }
        } catch (error) {
            message.error('Error al cargar los mantenimientos.');
        }
    };

    const handleViewDetails = (maintenance: IMaintenance) => {
        setSelectedMaintenance(maintenance);
        setIsDetailModalVisible(true);
    };

    const handleUpdateMaintenance = async (maintenance: IMaintenance) => {
        setSelectedMaintenance(maintenance);
        setIsUpdateModalVisible(true);
    };

    const handleUpdateSubmit = async (values: IVehicleStatus) => {
        if (!Object.values(values).includes(true)) {
            message.warning('Por favor. Seleccione los mantenimientos realizados.');
            return;
        }

        setLoading(true);
        try {
            await updateMaintenance(selectedMaintenance?.maintenanceId!, values);
            message.success('Mantenimiento actualizado con éxito.');
            setIsUpdateModalVisible(false);
            fetchMaintenances();
        } catch (error) {
            message.error('Error al actualizar el mantenimiento.');
        } finally {
            setLoading(false);
        }
    };

    const fieldNames: { [key: string]: string } = {
        scratches: 'Rasguños',
        dents: 'Abolladuras',
        lights: 'Luces',
        tires: 'Neumáticos',
        windshield: 'Parabrisas',
        mirrors: 'Espejos',
        foreignFluids: 'Fluidos extraños',
        brakes: 'Frenos',
        documents: 'Documentos',
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleMenuClick = (e: any) => {
        setFilter(e.key);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedMaintenances = maintenances.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <Menu onClick={handleMenuClick} selectedKeys={[filter]} mode="horizontal">
                <Menu.Item key="pending">Mantenimientos Pendientes</Menu.Item>
                <Menu.Item key="completed">Mantenimientos Anteriores</Menu.Item>
            </Menu>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', justifyContent: 'center', marginTop: '35px' }}>
                {paginatedMaintenances.map((maintenance) => {
                        const formattedDescription = maintenance.description.replace(/\n/g, '<br />');
                    return(
                    <Card
                        key={maintenance.maintenanceId}
                        bordered
                        style={{ width: '99%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <h3>{`Mantenimiento #${maintenance.maintenanceId} (${maintenance.status})`}</h3>
                                <Divider orientation="left">Detalles del Mantenimiento</Divider>
                                <p>
                                    <strong>Vehículo:</strong> {`${maintenance.vehicle.vehicle.licensePlate} (${maintenance.vehicle.vehicle.model.brand.brandName} - ${maintenance.vehicle.vehicle.model.modelName})`}
                                </p>
                                <p><strong>Fecha de Ingreso:</strong> {formatDate(maintenance.createDate)}</p>
                                <p>
                                    <strong>Último Mantenimiento:</strong> {maintenance.updateDate ? formatDate(maintenance.updateDate) : 'No hay fecha de mantenimiento'}
                                </p>
                            </Col>
                            <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Divider orientation="left">Acciones Realizadas</Divider>
                                <div dangerouslySetInnerHTML={{ __html: formattedDescription! }} />
                            </Col>
                        </Row>

                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <Button onClick={() => handleViewDetails(maintenance)} type="primary">
                                Detalles del Vehículo
                            </Button>
                            {filter === 'pending' && (
                                <Button onClick={() => handleUpdateMaintenance(maintenance)} type="dashed">
                                    Mantenimiento
                                </Button>
                            )}
                        </div>
                    </Card>
                )})}
            </div>

            <Pagination
                style={{ marginTop: '16px', textAlign: 'center' }}
                current={currentPage}
                pageSize={itemsPerPage}
                total={maintenances.length}
                onChange={handlePageChange}
            />

            <VehicleInfoModal
                visible={isDetailModalVisible}
                onClose={() => setIsDetailModalVisible(false)}
                vehicle={selectedMaintenance?.vehicle.vehicle!}
            />

            <Modal
                title={`Mantenimiento del Vehículo (${selectedMaintenance?.vehicle?.vehicle.licensePlate})`}
                open={isUpdateModalVisible}
                onCancel={() => setIsUpdateModalVisible(false)}
                onOk={() => form.submit()}
                okText={loading ? 'Actualizando...' : 'Actualizar'}
                cancelText="Cancelar"
                confirmLoading={loading}
            >
                <Divider />
                <strong>Mantenimientos Necesarios:</strong>
                <p>(Seleccione aquí los mantenimientos completados)</p>
                <Form form={form} onFinish={handleUpdateSubmit}>
                    {selectedMaintenance &&
                        Object.keys(selectedMaintenance?.vehicle!)
                            .filter((key) => key !== 'vehicleId' && selectedMaintenance?.vehicle[key] === false)
                            .map((key) => (
                                <Form.Item key={key} name={key} valuePropName="checked">
                                    <Checkbox>{fieldNames[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase()}</Checkbox>
                                </Form.Item>
                            ))}
                    <Form.Item label="Descripción del Mantenimiento Realizado" layout="vertical" required name="description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <br /> <br /> <br /> <br />
                </Form>
            </Modal>
        </div>
    );
};

export default MaintenancePage;
