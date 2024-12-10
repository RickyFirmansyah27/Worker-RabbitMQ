
const RABBITMQ_API_URL = 'https://armadillo.rmq.cloudamqp.com/api/queues/gxylgqlb';
const startTime = Date.now();

const rabbitmq_check = {
  async fetch(request, env, ctx) {
    const uptimeInSeconds = Math.floor((Date.now() - startTime) / 1000);

	const days = Math.floor(uptimeInSeconds / (3600 * 24)); 
	const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
	const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
	const seconds = uptimeInSeconds % 60;
	
    const uptimeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    try {

      const response = await fetch(RABBITMQ_API_URL, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa('gxylgqlb:OWeSHYsGOtgehoHdMHBwkbnvUOHLZQCI')
        }
      });

      if (!response.ok) {
        throw new Error('[CloudAMPQ] | RabbitMQ Connection failed');
      }
      const data = await response.json();
      return new Response(
        JSON.stringify({
          status: 'success',
          statusCode: 200,
          message: '[CloudAMPQ] | RabbitMQ Connection established',
          uptime: uptimeFormatted,
          queueStatus: data,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('[CloudAMPQ] | RabbitMQ Check Failed:', error);

      return new Response(
        JSON.stringify({
          status: 'error',
          statusCode: 500,
          message: '[CloudAMPQ] | RabbitMQ Check Failed',
          uptime: uptimeFormatted,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  },
};

export { rabbitmq_check as default };
