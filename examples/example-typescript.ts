import { ClusterScanner, NonceScanner, OperatorScanner } from 'ssv-scanner';

async function main() {
  const params = {
    network: 'hoodi',
    nodeUrl: 'https://ethereum-hoodi-rpc.publicnode.com',
    ownerAddress: '0x0000000000000000000000000000000000000000',
  };

  const operatorIds = [1, 2, 3, 4];

  const clusterScanner = new ClusterScanner(params);
  const result = await clusterScanner.run(operatorIds);
  console.log(JSON.stringify({
    block: result.payload.Block,
    'cluster snapshot': result.cluster,
    cluster: Object.values(result.cluster),
  }, null, 2));

  const nonceScanner = new NonceScanner(params);
  const nextNonce = await nonceScanner.run();
  console.log('Next Nonce:', nextNonce);

  const operatorScanner = new OperatorScanner(params);
  const operatorFilePath = await operatorScanner.run();
  if (operatorFilePath) {
    console.log('Operator data file:', operatorFilePath);
  } else {
    console.log('No operator data found for this owner.');
  }
}

void main();
