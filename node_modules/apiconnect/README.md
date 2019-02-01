### Features

The API Connect Developer Toolkit provides a visual designer and a set
of command-line tools for augmenting the local API create experience
and to make it easy for developers to interact with API Connect clouds
in Bluemix and on premises.

The toolkit includes the following features:

- **API Designer**: A visual tool for creating, testing, and
  publishing APIs and applications.

- **API Explorer**: A visual tool for exploring and testing APIs.

- **Loopback**: A highly-extensible, open-source Node.js framework for
  quickly creating dynamic end-to-end REST APIs.

- **Micro Gateway**: A gateway to support unit testing of policies to
  secure and enforce APIs as part of the local development experience.

- **The apic CLI**: A set of commands to augment the local API create
  experience and for publishing APIs and applications to API Connect
  clouds in Bluemix and on premises.



### Installation

```
$ npm install -g apiconnect
```

Preqrequisites:
- Node.js version 0.12.0 or version 4.x.
- On Windows, there are some additional prerequisites; see [Installing the toolkit](http://www.ibm.com/support/knowledgecenter/SSFS6T/com.ibm.apic.toolkit.doc/tapim_cli_install.html).

### Getting Started

1. Get help on the **apic** command set:

   ```
   $ apic -h
   ```

2. Create a LoopBack application (take the defaults selecting **hello-world** which installs a sample application):

   ```
   $ apic loopback --name notes
   ```

3. Change into the LoopBack application directory:

   ```
   $ cd notes
   ```

4. Start the services for the local unit test environment:

   ```
   $ apic start
   ```

5. Use `curl` to invoke the sample application to create a note and then list the notes.  Scroll to the right to see the full command :

   ```
   curl -k -X POST https://localhost:4002/api/Notes -H 'X-IBM-Client-Id: default' -H 'X-IBM-Client-Secret: SECRET' -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{ "title": "This is my first note" }' -v
   curl -k https://localhost:4002/api/Notes -H 'X-IBM-Client-Id: default' -H 'X-IBM-Client-Secret: SECRET'
   ```

6. Start the API Designer and explore the application:

   ```
   $ apic edit
   ```



### Additional Resources

* [API Connect documentation](http://www.ibm.com/support/knowledgecenter/SSMNED_5.0.0/)
* [Loopback.io](http://loopback.io)
