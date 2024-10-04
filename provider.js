const { Verifier } = require('@pact-foundation/pact');

describe('Pact Verification', () => {
  it('validates the expectations of the Order Service', async () => {
    const opts = {
      providerBaseUrl: 'http://localhost:3000', // URL of your running User Service
      pactUrls: [path.resolve(process.cwd(), 'pacts', 'order_service-user_service.json')], // Location of the Pact file
    };

    return new Verifier(opts).verifyProvider().then((output) => {
      console.log('Pact Verification Complete!');
      console.log(output);
    }).catch((error) => {
      console.error('Pact Verification Failed: ', error);
      throw error;
    });
  });
});
