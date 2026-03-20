const { ClusterScanner, NonceScanner, OperatorScanner } = require('ssv-scanner');

async function main() {
  const params = {
    network: 'hoodi',
    nodeUrl: 'https://ethereum-hoodi-rpc.publicnode.com',
    ownerAddress: '0x0000000000000000000000000000000000000000',
  };

  const operatorIds = [1, 2, 3, 4];

  const clusterScanner = new ClusterScanner(params);
  const clusterResult = await clusterScanner.run(operatorIds);
  console.log(JSON.stringify({
    block: clusterResult.payload.Block,
    'cluster snapshot': clusterResult.cluster,
    cluster: Object.values(clusterResult.cluster),
  }, null, 2));

  const nonceScanner = new NonceScanner(params);
  const nextNonce = await nonceScanner.run();
  console.log('Next nonce:', nextNonce);

  const operatorScanner = new OperatorScanner(params);
  const operatorFilePath = await operatorScanner.run();
  if (operatorFilePath) {
    console.log('Operator data file:', operatorFilePath);
  } else {
    console.log('No operator data found for this owner.');
  }
}

void main();
