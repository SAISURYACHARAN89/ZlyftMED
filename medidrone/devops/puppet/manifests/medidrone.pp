class medidrone {
  # Install Node.js
  class { 'nodejs':
    version => '18.x',
  }

  # Install MongoDB
  class { 'mongodb':
    version => '6.0',
  }

  # Create application user
  user { 'medidrone':
    ensure => present,
    home   => '/opt/medidrone',
    shell  => '/bin/bash',
  }

  # Create application directory
  file { '/opt/medidrone':
    ensure => directory,
    owner  => 'medidrone',
    group  => 'medidrone',
    mode   => '0755',
  }

  # Install PM2 for process management
  package { 'pm2':
    ensure   => installed,
    provider => 'npm',
  }

  # Configure firewall
  firewall { '100 allow http':
    proto  => 'tcp',
    dport  => 80,
    action => 'accept',
  }

  firewall { '101 allow https':
    proto  => 'tcp',
    dport  => 443,
    action => 'accept',
  }

  firewall { '102 allow backend':
    proto  => 'tcp',
    dport  => 5000,
    action => 'accept',
  }

  # Security hardening
  sysctl { 'net.ipv4.tcp_syncookies':
    value => '1',
  }

  sysctl { 'net.ipv4.conf.all.rp_filter':
    value => '1',
  }
}