// import Docker from "dockerode";
// import crypto from "crypto"

// const docker = new Docker({ socketPath: '//./pipe/docker_engine' }); // Windows Docker Desktop via TCP

// async function createUbuntuSSHContainer(memoryLimitMb = 512) {
//   const containerName = `ubuntu_ssh_${crypto.randomBytes(4).toString('hex')}`;
//   const sshPort = 2222;
//   const sshUser = "user";
//   const sshPass = "password";

//   console.log("🔄 Pulling Ubuntu image...");
//   await new Promise((resolve, reject) => {
//     docker.pull('ubuntu', (err, stream) => {
//       if (err) return reject(err);
//       docker.modem.followProgress(stream, resolve);
//     });
//   });

//   console.log("📦 Creating container...");
//   const container = await docker.createContainer({
//     Image: 'ubuntu',
//     name: containerName,
//     Tty: true,
//     ExposedPorts: {
//       '22/tcp': {}
//     },
//     HostConfig: {
//       Memory: memoryLimitMb * 1024 * 1024,
//       PortBindings: {
//         '22/tcp': [{ HostPort: sshPort.toString() }]
//       }
//     },
//     Cmd: ['/bin/bash']
//   });

//   console.log("🚀 Starting container...");
//   await container.start();

//   console.log("⚙️ Setting up SSH...");
//   const commands = [
//     'apt-get update',
//     'apt-get install -y openssh-server',
//     'mkdir -p /var/run/sshd',
//     `useradd -m -s /bin/bash ${sshUser}`,
//     `echo '${sshUser}:${sshPass}' | chpasswd`,
//     `sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config`,
//     `sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config`,
//     'service ssh start'
//   ];

//   for (const cmd of commands) {
//     const exec = await container.exec({
//       Cmd: ['bash', '-c', cmd],
//       AttachStdout: true,
//       AttachStderr: true
//     });

//     await new Promise((resolve, reject) => {
//       exec.start((err, stream) => {
//         if (err) return reject(err);
//         container.modem.demuxStream(stream, process.stdout, process.stderr);
//         stream.on('end', resolve);
//       });
//     });
//   }

//   console.log("✅ SSH server is ready!");

//   return {
//     containerName,
//     sshUrl: `ssh ${sshUser}@localhost -p ${sshPort}`,
//     sshUser,
//     sshPass
//   };
// }

// // Run the function
// createUbuntuSSHContainer().then(result => {
//   console.log("\n🔗 SSH Access URL:");
//   console.log(result.sshUrl);
//   console.log(`🔐 Username: ${result.sshUser}, Password: ${result.sshPass}`);
// }).catch(console.error);

import Docker from "dockerode";
import crypto from "crypto";
import net from "net";

const docker = new Docker({ socketPath: '//./pipe/docker_engine' }); // Windows Docker Desktop via TCP

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(false); // Port is in use
        } else {
          reject(err);
        }
      })
      .on('listening', () => {
        server.close();
        resolve(true); // Port is available
      })
      .listen(port);
  });
}

// Function to find an available port starting from a given port
async function getAvailablePort(startPort = 2222, maxTries = 10) {
  let port = startPort;
  let tries = 0;
  while (tries < maxTries) {
    const available = await isPortAvailable(port);
    if (available) return port;
    port++; // Try the next port
    tries++;
  }
  throw new Error("No available ports found.");
}

async function createUbuntuSSHContainer(memoryLimitMb = 512, identifier) {
  const containerName = `ubuntu_ssh_${identifier}`;
  let sshPort = 2222; // Starting port
  const sshUser = "user";
  const sshPass = "password";

  // Check for available port
  try {
    sshPort = await getAvailablePort(2222);
    console.log(`Using available SSH port: ${sshPort}`);
  } catch (error) {
    console.error("Error finding available port: ", error.message);
    return;
  }

  console.log("🔄 Pulling Ubuntu image...");
  await new Promise((resolve, reject) => {
    docker.pull('ubuntu', (err, stream) => {
      if (err) return reject(err);
      docker.modem.followProgress(stream, resolve);
    });
  });

  console.log("📦 Creating container...");
  const container = await docker.createContainer({
    Image: 'ubuntu',
    name: containerName,
    Tty: true,
    ExposedPorts: {
      '22/tcp': {}
    },
    HostConfig: {
      Memory: memoryLimitMb * 1024 * 1024,
      PortBindings: {
        '22/tcp': [{ HostPort: sshPort.toString() }]
      }
    },
    Cmd: ['/bin/bash']
  });

  console.log("🚀 Starting container...");
  await container.start();

  console.log("⚙️ Setting up SSH...");
  const commands = [
    'apt-get update',
    'apt-get install -y openssh-server',
    'mkdir -p /var/run/sshd',
    `useradd -m -s /bin/bash ${sshUser}`,
    `echo '${sshUser}:${sshPass}' | chpasswd`,
    `sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config`,
    `sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config`,
    'service ssh start'
  ];

  for (const cmd of commands) {
    const exec = await container.exec({
      Cmd: ['bash', '-c', cmd],
      AttachStdout: true,
      AttachStderr: true
    });

    await new Promise((resolve, reject) => {
      exec.start((err, stream) => {
        if (err) return reject(err);
        container.modem.demuxStream(stream, process.stdout, process.stderr);
        stream.on('end', resolve);
      });
    });
  }

  console.log("✅ SSH server is ready!");

  const output = {
    containerName,
    sshUrl: `ssh ${sshUser}@localhost -p ${sshPort}`,
    sshUser,
    sshPass
  }

  console.log(output)

  return output
}

async function deleteUbuntuSSHContainer(identifier) {
  const containerName = `ubuntu_ssh_${identifier}`;
  try {
    const container = docker.getContainer(containerName);
    await container.stop();
    await container.remove();
    console.log(`🗑️ Container '${containerName}' deleted successfully.`);
  } catch (err) {
    console.error(`❌ Failed to delete container '${containerName}':`, err.message);
  }
}


// Run the function
// export default createUbuntuSSHContainer
export { createUbuntuSSHContainer, deleteUbuntuSSHContainer };


// .then(result => {
//     console.log("\n🔗 SSH Access URL:");
//     console.log(result.sshUrl);
//     console.log(`🔐 Username: ${result.sshUser}, Password: ${result.sshPass}`);
//   }).catch(console.error);
  