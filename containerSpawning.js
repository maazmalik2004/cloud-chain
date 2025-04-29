const Docker = require('dockerode');
const docker = new Docker();

// Function to spawn an Ubuntu container with SSH setup
async function spawnUbuntuContainer() {
  try {
    // Create an Ubuntu container with specific memory allocation and port mapping for SSH
    const container = await docker.createContainer({
      Image: 'ubuntu:latest',  // Specify the image with version tag
      Cmd: ['/bin/bash'],     // Initial command
      name: 'my-ubuntu-container',  // Name of the container
      Tty: true,              // Allocate a pseudo-TTY for interactive shell
      OpenStdin: true,        // Keep stdin open
      StdinOnce: false,       // Keep stdin open even if not attached
      HostConfig: {
        Memory: 536870912,    // 512MB in bytes (corrected from MemLimit)
        PortBindings: {
          '22/tcp': [{ HostPort: '2222' }] // Bind container's port 22 to host's port 2222
        }
      },
      ExposedPorts: { 
        '22/tcp': {} // Expose SSH port
      }
    });

    console.log('Container created successfully with 512MB memory and exposed SSH port!');

    // Start the container
    await container.start();
    console.log('Container started successfully!');

    // Install OpenSSH server and configure SSH
    const execInstallSSH = await container.exec({
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ['/bin/bash', '-c', 'apt-get update && apt-get install -y openssh-server && mkdir -p /run/sshd && echo "PermitRootLogin yes" >> /etc/ssh/sshd_config && service ssh start']
    });

    const stream = await execInstallSSH.start({ hijack: true });
    // Wait for the command to complete
    await new Promise((resolve) => {
      docker.modem.demuxStream(stream, process.stdout, process.stderr);
      stream.on('end', resolve);
    });
    console.log('SSH server installed and started inside the container!');

    // Set the password for the root user
    const setPasswordExec = await container.exec({
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ['/bin/bash', '-c', 'echo "root:rootpassword" | chpasswd']
    });

    const passwordStream = await setPasswordExec.start({ hijack: true });
    // Wait for the command to complete
    await new Promise((resolve) => {
      docker.modem.demuxStream(passwordStream, process.stdout, process.stderr);
      passwordStream.on('end', resolve);
    });
    console.log('Password set for root user (rootpassword). You can change it as needed.');

    // Start SSH daemon to keep the container running
    const startSSHDaemon = await container.exec({
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ['/usr/sbin/sshd', '-D']
    });

    // Start the SSH daemon in detached mode
    await startSSHDaemon.start();
    console.log('SSH daemon started in the background.');

    console.log('You can now connect to the container via SSH at port 2222 on your host machine.');
    console.log('Use: ssh root@localhost -p 2222');

  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Call the function to spawn the container
spawnUbuntuContainer();