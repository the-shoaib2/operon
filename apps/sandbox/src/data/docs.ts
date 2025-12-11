export interface DocSection {
    title: string;
    content?: string; // Markdown supported
    commands?: Array<{
        name: string;
        description: string;
        cmd: string;
    }>;
}

export const moduleDocs: Record<string, DocSection[]> = {
    '/networking': [
        {
            title: 'Overview',
            content: 'The **Networking** module simulates a virtual network environment with 5 PCs. You can visualize different network topologies (Star, Mesh, Bus, Ring, Tree) and interact with each node.'
        },
        {
            title: 'Key Features',
            content: '- **Topologies**: Switch between 5 different network layouts.\n- **Packet Tracing**: Visualize packets moving across the network.\n- **File Transfer**: Copy or move files between PCs.\n- **Shell Access**: Execute commands on specific PCs.'
        },
        {
            title: 'Demo Commands',
            content: 'Use these commands in the terminal to interact with the network.',
            commands: [
                { name: 'Ping', description: 'Test connectivity to another host', cmd: 'ping 192.168.1.3' },
                { name: 'Trace Route', description: 'Trace path to a host', cmd: 'traceroute 192.168.1.3' },
                { name: 'SSH', description: 'Connect to a remote PC', cmd: 'ssh 192.168.1.3' },
                { name: 'Route Table', description: 'Show routing table', cmd: 'route' }
            ]
        }
    ],
    '/filesystem': [
        {
            title: 'Overview',
            content: 'The **File System** module provides a visual interface to manage files and folders on your simulated machines. It mimics a standard Unix-like file system.'
        },
        {
            title: 'Features',
            content: '- **Navigate**: Browse through directories.\n- **Manage**: Create, delete, and rename files and folders.\n- **Preview**: View file contents directly in the browser.\n- **Context Menu**: Right-click for quick actions.'
        },
        {
            title: 'Common Operations',
            content: 'You can perform these actions via the UI or Shell:',
            commands: [
                { name: 'List Files', description: 'List directory contents', cmd: 'ls -la' },
                { name: 'Make Directory', description: 'Create a new folder', cmd: 'mkdir my_project' },
                { name: 'Create File', description: 'Create a new empty file', cmd: 'touch notes.txt' },
                { name: 'Read File', description: 'Display file content', cmd: 'cat notes.txt' }
            ]
        }
    ],
    '/shell': [
        {
            title: 'Overview',
            content: 'The **Shell** provides a command-line interface (CLI) for direct interaction with the system kernel. It supports standard Unix commands and pipes.'
        },
        {
            title: 'Supported Commands',
            content: 'The shell supports a variety of built-in commands for file manipulation, networking, and system status.',
            commands: [
                { name: 'Echo', description: 'Print text to screen', cmd: 'echo "Hello World"' },
                { name: 'System Status', description: 'Show system info', cmd: 'status' },
                { name: 'Process List', description: 'Show running processes', cmd: 'ps' },
                { name: 'Clear', description: 'Clear the terminal screen', cmd: 'clear' }
            ]
        }
    ],
    '/mcp': [
        {
            title: 'Overview',
            content: '**MCP (Message Control Protocol)** allows you to inspect and interact with the communication layer between agents and tools. It acts as a registry for available tools.'
        },
        {
            title: 'Usage',
            content: '1. **Select Tool**: Choose a tool from the available list.\n2. **Configure**: Provide arguments (JSON or File Selection).\n3. **Execute**: Run the tool and view the output.'
        },
        {
            title: 'Example Tools',
            commands: [
                { name: 'List Files', description: 'List files via MCP', cmd: '{"path": "/"}' },
                { name: 'Read File', description: 'Read file content via MCP', cmd: '{"path": "/home/readme.txt"}' }
            ]
        }
    ],
    '/memory': [
        {
            title: 'Overview',
            content: 'The **Memory** module visualizes the system\'s RAM usage. It displays allocation blocks, heap usage, and memory fragmentation.'
        },
        {
            title: 'Features',
            content: '- **Visual Grid**: See memory blocks in real-time.\n- **Allocation**: Request memory allocation.\n- **Garbage Collection**: Trigger GC to free up space.'
        },
        {
            title: 'Demo',
            content: 'Use the controls to allocate random memory blocks or clear memory to see the visual updates.'
        }
    ],
    '/process': [
        {
            title: 'Overview',
            content: 'The **Process Manager** handles CPU scheduling and process lifecycle. It mimics a round-robin scheduler.'
        },
        {
            title: 'Features',
            content: '- **Process List**: View active, running, and sleeping processes.\n- **CPU Usage**: Monitor CPU load.\n- **Control**: Kill, detailed view, or prioritize processes.'
        },
        {
            title: 'Key Metrics',
            content: '- **PID**: Process ID\n- **State**: Running, Ready, Blocked\n- **CPU %**: Processor time consumption'
        }
    ]
};
