import app from './app';
import config from './gateways/config/config';

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});