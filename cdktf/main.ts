import { Construct } from 'constructs';
import { App, TerraformStack, TerraformVariable } from 'cdktf';

import { AwsProvider } from './.gen/providers/aws/provider';
import { Vpc } from './.gen/providers/aws/vpc';
import { Subnet } from './.gen/providers/aws/subnet';
import { InternetGateway } from './.gen/providers/aws/internet-gateway';
import { RouteTable } from './.gen/providers/aws/route-table';
import { Route } from './.gen/providers/aws/route';
import { RouteTableAssociation } from './.gen/providers/aws/route-table-association';
import { SecurityGroup } from './.gen/providers/aws/security-group';
import { Instance } from './.gen/providers/aws/instance';

class NodeAppStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, 'aws', {
      region: 'eu-central-1',
    });

    const ghcrPat = new TerraformVariable(this, 'ghcr_pat', {
      type: 'string',
      sensitive: true,
    });

    const ghcrUser = new TerraformVariable(this, 'ghcr_user', {
      type: 'string',
    });

    const dockerImage = new TerraformVariable(this, 'docker_image', {
      type: 'string',
    });

    const vpc = new Vpc(this, 'AirlineFeVPC', {
      cidrBlock: '10.0.0.0/16',
      enableDnsHostnames: true,
      tags: { Name: 'AirlineFeVPC' },
    });

    const subnet = new Subnet(this, 'AirlineFeSubnet', {
      vpcId: vpc.id,
      cidrBlock: '10.0.1.0/24',
      availabilityZone: 'eu-central-1a',
      mapPublicIpOnLaunch: true,
      tags: { Name: 'AirlineFeSubnet' },
    });

    const igw = new InternetGateway(this, 'AirlineFeIGW', {
      vpcId: vpc.id,
    });

    const routeTable = new RouteTable(this, 'AirlineFeRouteTable', {
      vpcId: vpc.id,
    });

    new Route(this, 'Route', {
      routeTableId: routeTable.id,
      destinationCidrBlock: '0.0.0.0/0',
      gatewayId: igw.id,
    });

    new RouteTableAssociation(this, 'RouteAssoc', {
      routeTableId: routeTable.id,
      subnetId: subnet.id,
    });

    const sg = new SecurityGroup(this, 'AirlineFeSG', {
      vpcId: vpc.id,
      ingress: [
        { fromPort: 22, toPort: 22, protocol: 'tcp', cidrBlocks: ['0.0.0.0/0'] },
        { fromPort: 80, toPort: 80, protocol: 'tcp', cidrBlocks: ['0.0.0.0/0'] },
        { fromPort: 443, toPort: 443, protocol: 'tcp', cidrBlocks: ['0.0.0.0/0'] },
      ],
      egress: [
        { fromPort: 0, toPort: 0, protocol: '-1', cidrBlocks: ['0.0.0.0/0'] },
      ],
    });

    new Instance(this, 'AirlineFeInstance', {
      ami: 'ami-02003f9f0fde924ea', // Ubuntu Server 24.04 LTS
      instanceType: 't2.micro',
      subnetId: subnet.id,
      vpcSecurityGroupIds: [sg.id],
      associatePublicIpAddress: true,
      keyName: 'my-ec2-key',
      userData: `#!/bin/bash
apt update -y && apt install -y docker.io nginx

systemctl start docker
systemctl enable docker

# GHCR Login
echo "${ghcrPat.stringValue}" | docker login ghcr.io -u ${ghcrUser.stringValue} --password-stdin

# Pull & run app
docker run -d -p 3001:3001 -e NUXT_PUBLIC_API=https://airline-api.kokai.xyz --name airline-fe ${dockerImage.stringValue}

# Nginx reverse proxy
cat <<EOF > /etc/nginx/sites-available/default
server {
  listen 80;
  server_name airline-fe.kokai.xyz;

  location / {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \\$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \\$host;
    proxy_cache_bypass \\$http_upgrade;
  }
}
EOF

systemctl restart nginx
      `,
      tags: { Name: 'AirlineFeInstance' },
    });
  }
}

const app = new App();

new NodeAppStack(app, 'airline-fe-ghcr-nodeapp-stack');

app.synth();
