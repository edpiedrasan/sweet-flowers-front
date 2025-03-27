import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { FaPowerOff, FaRegLightbulb } from 'react-icons/fa';
import './HomeScreen.css';

export const IndexSmartAutomation = () => {
    let history = useHistory();

    const [gpioStatus, setGpioStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGpioStatus = async () => {
        try {
            const response = await fetch('https://polemic-quetzal-1242.dataplicity.io/gpio');
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            const data = await response.json();
            setGpioStatus(data);
            setLoading(false);
        } catch (error) {
            setError('No se pudo cargar el estado de los GPIOs');
            setLoading(false);
        }
    };

    const toggleGpio = async (gpioId, currentState) => {
        try {
            setLoading(true);
            const newState = currentState === 0 ? 1 : 0;
            await fetch(`https://polemic-quetzal-1242.dataplicity.io/gpio/${gpioId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ turn: newState }),
            });
            fetchGpioStatus();
        } catch (error) {
            console.error('Error toggling GPIO:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGpioStatus();
    }, []);

    const handleBack = () => {
        history.goBack();
    };

    return (
        <div className="dark-theme">
            <Container fluid>

                <Row className="dashboard">
                    <Col xs="2" className="">

                    </Col>
                    <Col xs="9">
                        <Row>
                            <Col>
                                <h1 className="title">Control de Riego</h1>

                            </Col>
                            <Col>
                                <Button
                                    color="light"
                                    onClick={handleBack}
                                    className="back-button"
                                >
                                    Volver
                                </Button>
                            </Col>

                        </Row>

                        <p className="subtitle">
                            Señales encendidas: {gpioStatus.filter(gpio => gpio[2] === 1).length} / {gpioStatus.length}
                        </p>
                    </Col>
                </Row>
                {loading ? (
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <Spinner color="light" />
                        </Col>
                    </Row>
                ) : error ? (
                    <Row className="justify-content-center">
                        <Col xs="12" className="text-center">
                            <p className="errorText">{error}</p>
                        </Col>
                    </Row>
                ) : (
                    <Row className="gpio-grid">
                        {gpioStatus.map((gpio) => (
                            <Col key={gpio[0]} sm="6" md="4" lg="3" className="gpio-col">
                                <Card className={`gpio-card ${gpio[2] === 1 ? 'active' : ''}`}>
                                    <CardBody>
                                        <CardTitle tag="h3">{`Señal ${gpio[0]}`}</CardTitle>
                                        <CardText>
                                            <span className={`label`}>
                                                {gpio[1]}
                                            </span>
                                        </CardText>
                                        <CardText>
                                            <span className={`status ${gpio[2] === 1 ? 'on' : 'off'}`}>
                                                {gpio[2] === 1 ? 'Encendido' : 'Apagado'}
                                            </span>
                                        </CardText>
                                        <Button
                                            color={gpio[2] === 1 ? 'danger' : 'success'}
                                            onClick={() => toggleGpio(gpio[0], gpio[2])}
                                            className="action-button"
                                        >
                                            {gpio[2] === 1 ? (
                                                <FaPowerOff style={{ marginRight: "5px" }} />
                                            ) : (
                                                <FaRegLightbulb style={{ marginRight: "5px" }} />
                                            )}
                                            {gpio[2] === 1 ? 'Apagar' : 'Encender'}
                                        </Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};
