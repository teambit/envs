export type WorkspaceOptions = { 
    path: string,
    compiler: string
}

export class WorkspaceHelper { 
    create(_opts: WorkspaceOptions) {
        return Promise.resolve(true)
    }

    build(_opts: WorkspaceOptions){ 
        return Promise.resolve(true)
    }

    test(_opts: WorkspaceOptions){ 
        return Promise.resolve(true)
    }
}

