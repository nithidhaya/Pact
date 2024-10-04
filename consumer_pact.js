import { Pact } from '@pact-foundation/pact';
import path from 'path';
import axios from 'axios';
import pact from '@pact-foundation/pact'; // Import the entire package
import { expect } from 'chai';

const provider = new Pact({
    consumer: 'OrderService',
    provider: 'UserService',
    port: 8081,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'info',
    spec: 2
});

describe('Pact with User Service', () => {
    before(() => provider.setup());
    after(() => provider.finalize());
    afterEach(() => provider.verify());

    it('should fetch user details successfully', async () => {
        const expectedUserDetails = {
            userId: pact.Matchers.like('12345'), // Use Matchers like this
            firstName: pact.Matchers.like('John'),
            lastName: pact.Matchers.like('Doe'),
            email: pact.Matchers.like('john.doe@example.com'),
            age: pact.Matchers.like(30),
            address: {
                street: pact.Matchers.like('123 Main St'),
                city: pact.Matchers.like('Springfield'),
                state: pact.Matchers.like('IL'),
                zipCode: pact.Matchers.like('62704')
            }
        };

        await provider.addInteraction({
            state: 'User exists',
            uponReceiving: 'a request for user details',
            withRequest: {
                method: 'GET',
                path: '/users/12345',
                headers: { Accept: 'application/json' }
            },
            willRespondWith: {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: expectedUserDetails
            }
        });

        const response = await axios.get('http://localhost:8081/users/12345', {
            headers: { Accept: 'application/json' }
        });

        // Check response status and extract values from the matcher
        expect(response.status).to.equal(200);
        expect(response.data.userId).to.equal('12345');
        expect(response.data.firstName).to.equal('John');
        expect(response.data.lastName).to.equal('Do');
        expect(response.data.email).to.equal('john.doe@example.com');
        expect(response.data.age).to.equal(30);

        expect(response.data.address.street).to.equal('123 Main St');
        expect(response.data.address.city).to.equal('Springfield');
        expect(response.data.address.state).to.equal('IL');
        expect(response.data.address.zipCode).to.equal('62704');
    });
});
