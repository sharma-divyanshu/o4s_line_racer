# O4S Line Racer

All 3 processes (M, R1, R2) execute inside their own Docker containers.

## Run instructions:

Before running, [download and install Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/)

Then, pick the version of docker-compose file to run:
* [docker-compose.yaml](https://github.com/sharma-divyanshu/o4s_line_racer/blob/master/docker-compose.yaml) starts the containers for [M, R1, R2] and starts the processes. When R1 and R2 exit, the containers are stopped automatically.
```bash
$ docker-compose up
```
The STDOUT from all three processes will be piped to the host.
* [docker-compose_alternative.yaml](https://github.com/sharma-divyanshu/o4s_line_racer/blob/master/docker-compose_alternative.yaml) starts the containers for [M, R1, R2] but **does not** start the processes. Manually start all three processes by accessing the containers.
```bash
$ docker-compose -f docker-compose_alternate.yaml up -d
```
For R1 and R2:
```bash
$ docker exec -it <R1/R2> bash
$ node o4s/code/racer.js
```
For M:
```bash
$ docker exec -it M bash
$ node o4s/code/master.js
```
Output of the master process's last run (M) is saved in `/o4s/master.log` on the M container. Each line of the log is of format `[LapNumber.`<code>[(m<sub>1</sub>, c<sub>1</sub>), (m<sub>2</sub>, c<sub>2</sub>)]</code>`, LapStart, LapEnd, TimeToCompletion, AverageLatencyR1, AverageLatencyR2]`, and sorted by the TimeToCompletion in ascending order.
