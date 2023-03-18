import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function InputForm(props) {
  const [lambda, setLambda] = useState('');
  const [mean, setMean] = useState('');
  const [distribution, setDistribution] = useState('exponential');
  const [server, setServer] = useState('1');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');

  function calculateOutput(lambda, mean, distribution, server, minValue, maxValue) {
    // Convert input values to numbers
    lambda = parseFloat(lambda);
    mean = parseFloat(mean);
    minValue = parseFloat(minValue);
    maxValue = parseFloat(maxValue);
  
    // Calculate service time distribution parameters
    let mu;
    let variance;
    if (distribution === 'exponential') {
      mu = 1 / mean;
      variance = 1 / Math.pow(mean, 2);
    } else if (distribution === 'uniform') {
      mu = (minValue + maxValue) / 2;
      variance = Math.pow(maxValue - minValue, 2) / 12;
    } else if (distribution === 'gamma') {
      const alpha = Math.pow(mean, 2) / variance;
      const beta = variance / mean;
      mu = alpha * beta;
      variance = alpha * Math.pow(beta, 2);
    }
  
    // Calculate output parameters
    const rho = lambda / (server * mu);
    const Lq = Math.pow(rho, 2) / (1 - rho) * (server / (server - 1));
    const L = Lq + lambda / mu;
    const Wq = Lq / lambda;
    const W = Wq + 1 / mu;
    const P0 = 1 - rho;
    const Pn = Math.pow(rho, server) * P0 / (factorial(server) * (1 - rho));
    const Ls = lambda * W;
    const U = lambda / (server * mu);
    const idleTime = 1 / mu * (1 - U);
  
    // Output results to console
    console.log(`Average Number of Customers in the System: ${L.toFixed(2)}`);
    console.log(`Average Number of Customers in the Queue: ${Lq.toFixed(2)}`);
    console.log(`Average Waiting Time in the System: ${W.toFixed(2)}`);
    console.log(`Average Waiting Time in the Queue: ${Wq.toFixed(2)}`);
    console.log(`Probability of n Customers: ${Pn.toFixed(4)}`);
    console.log(`Average Number of Customers when it's not Empty: ${Ls.toFixed(2)}`);
    console.log(`Utilization of the Server: ${U.toFixed(2)}`);
    console.log(`Idle Time of the Server: ${idleTime.toFixed(2)}`);
  }
  
  // Helper function to calculate factorials
  function factorial(n) {
    if (n === 0 || n === 1) {
      return 1;
    } else {
      return n * factorial(n - 1);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    // props.onSubmit(lambda, mean, distribution, server, minValue, maxValue);
    calculateOutput(lambda, mean, distribution, server, minValue, maxValue);

  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formLambda">
        <Form.Label>Mean of Poisson Distribution (λ)</Form.Label>
        <Form.Control type="number" step="0.01" value={lambda} onChange={(e) => setLambda(e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="formMean">
        <Form.Label>Mean of Service Time Distribution</Form.Label>
        <Form.Control type="number" step="0.01" value={mean} onChange={(e) => setMean(e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="formDistribution">
        <Form.Label>Type of Service Time Distribution</Form.Label>
        <Form.Control as="select" value={distribution} onChange={(e) => setDistribution(e.target.value)}>
          <option value="exponential">Exponential</option>
          <option value="uniform">Uniform</option>
          <option value="gamma">Gamma</option>
        </Form.Control>
      </Form.Group>
      {distribution === 'uniform' || distribution === 'gamma' ? (
        <div>
          <Form.Group controlId="formMinValue">
            <Form.Label>Minimum Value</Form.Label>
            <Form.Control type="number" step="0.01" value={minValue} onChange={(e) => setMinValue(e.target.value)} required />
          </Form.Group>
          <Form.Group controlId="formMaxValue">
            <Form.Label>Maximum Value</Form.Label>
            <Form.Control type="number" step="0.01" value={maxValue} onChange={(e) => setMaxValue(e.target.value)} required />
          </Form.Group>
        </div>
      ) : null}
      <Form.Group controlId="formServer">
        <Form.Label>Number of Servers</Form.Label>
        <Form.Control as="select" value={server} onChange={(e) => setServer(e.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
        </Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit">
        Calculate
      </Button>
    </Form>
  );
}

export default InputForm;