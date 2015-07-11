---
layout: post
title: NTP Server Configuration
---

[Network Time Protocol](https://en.wikipedia.org/wiki/Network_Time_Protocol) (NTP) is used to synchronize computers around the world to allow for better communications on networks with changing latency such as the internet. This is done with a tiered infrastructure of timing devices.

The top tier, stratum zero, consists of high precision time devices like [atomic clocks](https://en.wikipedia.org/wiki/Atomic_clock) or [global positioning system clocks](https://en.wikipedia.org/wiki/GPS_clock#GPS_clocks) that keep extremely precise time. Below this tier is stratum one which consists of servers with their system clocks closely synchronized with an attached stratum zero device. Next are the stratum two servers with synchronization to stratum one servers and so on.

To avoid overloading stratum one servers with time requests from clients most stratum one servers are not available for public time requests. Instead, many stratum two servers are maintained specifically for the purpose of providing time synchronization to any client machine. These servers are often managed by businesses for their internal networks but many are managed by organizations like universities or the National Institute of Standards and Technology (NIST) for general use.

The rest of this article will explain how to implement your own time server and configure it.

##Planning

We need to choose public servers to synchronize with. There are several lists we can choose upstream servers from.

* [NTP.org](http://support.ntp.org/bin/view/Servers/WebHome#Browsing_the_Lists)
* [NTP Pool Project](http://www.pool.ntp.org/)
* [NIST Internet Time Servers](http://tf.nist.gov/tf-cgi/servers.cgi)

There are [a few things](http://support.ntp.org/bin/view/Support/SelectingOffsiteNTPServers#Section_5.3.1.) to keep in mind when selecting your upstream servers.
1. Do not use any time servers which you do not have permission to use! The severs you select should be:
   * Public time servers made available by your service provider or OS vendor to their customers
   * And/or, other private time servers for which you have been given explicit permission and instructions on proper use
   * And/or, the time servers designated by the pool.ntp.org project
   * And/or, on one of the public lists of time servers
2. Make sure your selected servers are diverse and not maintained by or synchronized with the same organizations.
3. Make sure your selected servers are moderately close to your network location. This is not super critical, but try to avoid servers half way around the world.

There may be other things specific to your implementation, but this will give you a good start. For more information, check out the [official NTP guidelines](http://support.ntp.org/bin/view/Support/SelectingOffsiteNTPServers#Section_5.3.1.) for server selection.

It is [recommended](http://support.ntp.org/bin/view/Support/SelectingOffsiteNTPServers#Section_5.3.3.) that you choose at least five upstream servers to allow your system to protect against up to two *falsetickers*, servers that are not reporting the correct time. Depending on your needs, you may want to consider using more.

For this guide, I've selected seven stratum one servers from around the United States to create a stratum two server for my network. When I selected my servers, I took care to only pick servers that are **OpenAccess** and did not require **NotificationMessage**. Be careful when selecting your own servers as many require a NotificationMessage but neglected to change their policy to RestrictedAccess as [specifically requested](http://support.ntp.org/bin/view/Servers/NotificationMessage) by ntp.org (Grumble, grumble).

* [ntp.your.org](http://support.ntp.org/bin/view/Servers/PublicTimeServer000498)
* [time-b.timefreq.bldrdoc.gov](http://support.ntp.org/bin/view/Servers/PublicTimeServer000280)
* [rackety.udel.edu](http://support.ntp.org/bin/view/Servers/PublicTimeServer000290)
* [clock.fmt.he.net](http://support.ntp.org/bin/view/Servers/PublicTimeServer000011)
* [gpstime.la-archdiocese.net](http://support.ntp.org/bin/view/Servers/PublicTimeServer000787)
* [nist1.columbiacountyga.gov](http://support.ntp.org/bin/view/Servers/PublicTimeServer000378)
* [gclock02.dupa01.burst.net](http://support.ntp.org/bin/view/Servers/PublicTimeServer000974)

##Installation

This guide will work with NTP on CentOS. Other Linux distributions will have slight differences but should not be to difficult to configure using this guide.
First, install the Network Time Protocol.

`yum install ntp -y`

You will likely want NTP to start on boot. CentOS 7 uses SystemD to manage services. Use the following command to enable starting on boot.

`systemctl enable ntpd`

If you are running an older version of CentOS you will need to use chkconfig to do this.

`chkconfig ntpd on`

Now our NTP service will run every time the server boots. At this point we're ready to start configuring the server. We won't start the service yet, we'll wait until we have a basic configuration to test first.

##Server Configuration

Now that you have selected your upstream servers and have installed NTP on your own server, you are ready to start configuring NTP to synchronize. We will first make a backup of your original NTP configuration file so we can look through it later. For now though we will delete the original (But not the backup!), and then create our own config file to work with.

`cp /etc/ntp.conf /etc/ntp.conf.bak`

`rm /etc/ntp.conf`

`nano /etc/ntp.conf`

If you want to return to the original file, just replace the actual file with your backup to start over by running the following command.

`cp /etc/ntp.conf.bak /etc/ntp.conf`

Here is an example ntp.conf file that I'll be using to explain the basic concepts of the configuration.

    # Drift file.
    driftfile /var/lib/ntp/drift
    # Permit
    restrict default limited kod nomodify notrap nopeer
    restrict -6 default limited kod nomodify notrap nopeer
    # Servers
    server ntp.your.org iburst
    server time-b.timefreq.bldrdoc.gov iburst
    server rackety.udel.edu iburst
    server clock.fmt.he.net iburst
    server gpstime.la-archdiocese.net iburst
    server nist1.columbiacountyga.gov iburst
    server gclock02.dupa01.burst.net iburst
    disable monitor

Now lets break down each of these pieces and figure out what they do.
First, the **drift file**. The drift file stores information about your system clock's drift tendency. Most system clocks keep time reasonably well but still require synchronization in order to remain accurate. The drift file keeps track of how much your system clock tends to drift from actual time. Then, if you lose your connection to your synchronization servers, it can correct itself based on the drift data it has collected. This give you a bit of slack to work with if your connections ever go down.

The **restrict** lines restricts what external machines can do to our server. The **server **lines define the addresses we will attempt to synchronize with. First we declare the server name and then add the **iburst** parameter. The [iburst parameter](http://doc.ntp.org/4.1.1/confopt.htm) has the service send a burst of eight packets instead of only one when the server is unreachable to help speed up the time to acquire a connection.
The **disable monitor** line [fixes a vulnerability](http://support.ntp.org/bin/view/Main/SecurityNotice#DRDoS_Amplification_Attack_using) from January 2014 on older versions of NTP.

We can now save our config file and start the service!

`systemctl start ntpd`

or

`service ntpd start`

Now that the NTP service is running, we need to make sure our firewall is configured to allow incoming NTP traffic so our clients can synchronize with our server.

`firewall-cmd --permanent --add-service=ntp`

`systemctl restart firewalld`

or

`iptables -A INPUT -p tcp --dport 123 -j ACCEPT`

`/sbin/service iptables save`

`service iptables restart`

Once the server is running we can use the command `ntpq -p` to list our servers and view details about our connections to them. We can also use `ntpstat` to see our current synchronization status. For details on what this data means, check the [NTP documentation page for the ntpq command](http://doc.ntp.org/4.2.4/ntpq.html).

##Client Configuration

The client configuration is much simpler than the server configuration was. First, repeat the installation steps for the NTP service. Next, repeat the configuration steps but when you create your new ntp.conf file we will do some things differently.

    # Drift file.
    driftfile /var/lib/ntp/drift
    # Permit
    restrict default limited kod nomodify notrap nopeer
    restrict -6 default limited kod nomodify notrap nopeer
    # Servers
    server time.mydomain.com iburst

Since our source is known, and likely internal, we can get away with a bit less security. Also, since we don't need anything to connect to the clients on an incoming port, we don't need to modify our firewall rules as long as outgoing traffic is unrestricted (As it is by default).
Finally, use the `ntpq -p` and `ntpstat` commands to verify your NTP service is synchronizing with your server.

Congratulations! You have just finished configuring your basic NTP server and clients! There are several more things we could do to improve security and redundancy but this is where this particular guide will end.
