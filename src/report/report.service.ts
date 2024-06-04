import { Injectable } from "@nestjs/common";
import { join } from "path";
import { Attendance } from "src/attendance/attendance.entity";
import { AttendanceService } from "src/attendance/attendance.service";
import { RequestUser } from "src/common/intefaces/request-user";
import { EventService } from "src/event/event.service";
import { Lab } from "src/lab/lab.entity";
import { LabService } from "src/lab/lab.service";
import { UserRole } from "src/user/enums";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { VisitorService } from "src/visitor/visitor.service";

const PDFDocument = require('pdfkit-table');

@Injectable()
export class ReportService {
    constructor(
        private attendanceService: AttendanceService,
        private labService: LabService,
        private userService: UserService,
        private visitorService: VisitorService,
        private eventService: EventService
    ){}

    async attendancesByLabAndDate(requestUser: RequestUser) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const firstDay = new Date(year, 0, 1);
        const datesOfYear = [];
        const auxDate = new Date(firstDay);

        while (auxDate <= currentDate) {
            datesOfYear.push(new Date(auxDate));
            auxDate.setDate(auxDate.getDate() + 1);
        }

        const attendances: Attendance[] = await this.attendanceService.findAll(
            {},
            {startDate: firstDay},
            requestUser
        );

        const labs: Lab[] = await this.labService.findAll({});

        const report = [];

        datesOfYear.forEach((date: Date) => {
            labs.forEach((lab: Lab) => {
                report.push({
                    lab: lab.suneduCode,
                    count: attendances.filter((attendance) => {
                        const timeZone = -(attendance.dateRecord.createdAt.getTimezoneOffset() / 60);
                        const dateAux = new Date(attendance.dateRecord.createdAt)
                        dateAux.setHours(attendance.dateRecord.createdAt.getHours() - (timeZone + 5));
                        if (attendance.labId === lab.id && 
                            dateAux.getDate() === date.getDate() && 
                            dateAux.getFullYear() === date.getFullYear() && 
                            dateAux.getMonth() === date.getMonth()
                        ) return true 
                        else return false
                    }).length,
                    date: date.getTime(),
                })
            })
        });

        return report;
    }

    async attendancesByUser(requestUser: RequestUser) {
        const attendances: Attendance[] = await this.attendanceService.findAll(
            {
                session: true,
            },
            {},
            requestUser
        );

        const users: User[] = (await this.userService.findAll({})).filter((user: User) => user.role == UserRole.EMPLOYEE);

        const report = [];

        users.forEach((user: User) => {
            report.push({
                user: user.account.firstName,
                count: attendances.filter((attendance: Attendance) => attendance.session.userId == user.id).length
            });
        })

        return report;
    }

    async numberOfVisitors(): Promise<number> {
        return this.visitorService.count();
    }

    async numberOfEvents(): Promise<number> {
        return this.eventService.count();
    }

    async numberOfLabs(): Promise<number> {
        return this.labService.count();
    }

    async numberOfAttendances(requestUser: RequestUser): Promise<number> {
        return this.attendanceService.count(requestUser);
    }

    async pdfAttendancesByUser(month: number, requestUser: RequestUser): Promise<Buffer> {

        const attendances: Attendance[] = await this.attendanceService.findAll(
            {
                session: true,
                visitor: true,
            },
            {
                startDate: new Date(new Date().getFullYear(), month, 1),
                endDate: new Date(new Date().getFullYear(), month + 1, 0)
            },
            requestUser
        );

        const user: User = await this.userService.findOneById(requestUser.id, {lab: true}, requestUser);

        const rowsAttendances = attendances.map( (attendance, index) => {
            attendance.dateRecord.createdAt.setHours(attendance.dateRecord.createdAt.getHours() - 13);

            const date = attendance.dateRecord.createdAt.getDate();
            const month = attendance.dateRecord.createdAt.getMonth() + 1;
            const year = attendance.dateRecord.createdAt.getFullYear();

            const hour = attendance.dateRecord.createdAt.getHours();
            const minute = attendance.dateRecord.createdAt.getMinutes();

            return [
                String(index),
                attendance.visitor.studentCode,
                `${attendance.visitor.account.lastName}, ${attendance.visitor.account.firstName}`,
                attendance.visitor.career,
                (date < 10 ? '0' : '') + date + '/' + (month < 10 ? '0' : '') + month + '/' + year,
                (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute + (hour >= 12 ? 'PM' : 'AM')
            ]
        })

		const pdfBuffer: Buffer = await new Promise(resolve => {
		  const doc = new PDFDocument(
			{
			  size: "LETTER",
			  bufferPages: true,
			  autoFirstPage: false,
			})
	
		  let pageNumber = 0;
		  doc.on('pageAdded', () => {
			pageNumber++
			//let bottom = doc.page.margins.bottom;

            doc.opacity(0.5);
            doc.image(join(process.cwd(), "public/logo_unamad.png"), 50, 35, { fit: [50, 50], align: 'center' })

            doc.font("Helvetica").fontSize(10);
            doc.text('“UNIVERSIDAD NACIONAL AMAZÓNICA DE MADRE DE DIOS”', 65, 40, {align: 'center'});
            doc.font("Helvetica-Bold").fontSize(11);
            doc.text('CENTROS UNIVERSITARIOS DE CONECTIVIDAD', {
                align: 'center',
            });
            doc.font("Helvetica").fontSize(9);
            doc.text('“AÑO DEL BICENTENARIO, DE LA CONSOLIDACIÓN DE NUESTRA INDEPENDENCIA, Y DE LA CONMEMORACIÓN DE LAS HEROICAS BATALLAS DE JUNÍN Y AYACUCHO”', {
                align: 'center',
            });

            doc.image(join(process.cwd(), "public/logo_cenunc.png"), doc.page.width - 100, 40, { fit: [45, 45], align: 'center' })
            /*doc.moveTo(50, 55)
            .lineTo(doc.page.width - 50, 55)
            .stroke();*/
            
	
			doc.page.margins.bottom = 0;
			doc.font("Helvetica").fontSize(8);
			doc.text(
                'Pág. ' + pageNumber,
                0.5 * (doc.page.width - 100),
                doc.page.height - 50,
                {
                    width: 100,
                    align: 'center',
                    lineBreak: false,
                }
            )
              
            doc.opacity(1);

			doc.page.margins.bottom = 20;
            doc.page.margins.top = 100;
		  })

		  doc.addPage();
		  doc.text('', 50, 70)
		  doc.fontSize(24);
		  doc.moveDown();
		  doc.font("Helvetica").fontSize(12);
		  doc.text("REPORTE DE ESTUDIANTES ATENDIDOS", {
			width: doc.page.width - 100,
			align: 'center'
		  });

          doc.moveDown();

          doc.font("Helvetica-Bold").fontSize(10);
		  doc.text("Laboratorio: ", {
			continued: true
		  });
          doc.font("Helvetica").fontSize(10);
          doc.text(`${user.lab.suneduCode}`);

          doc.font("Helvetica-Bold").fontSize(10);
		  doc.text("Especialista: ", {
			continued: true
		  });
          doc.font("Helvetica").fontSize(10);
          doc.text(`${user.account.lastName}, ${user.account.firstName}`);

          doc.font("Helvetica-Bold").fontSize(10);
		  doc.text("Fecha: ", {
			continued: true
		  });
          doc.font("Helvetica").fontSize(10);
          doc.text(`01/05/2024 - 31/05/2024`);
          
          doc.moveDown();
	
		  const table = {
			/*title: `Especialista: ${user.account.lastName}, ${user.account.firstName}`,
			subtitle: `Laboratorio: ${user.lab.suneduCode}`,*/
			headers: ["N°", "Código", "Apellidos y Nombres", "Carrera", "Fecha", "Hora"],
			rows: rowsAttendances
		  };
	
		  doc.table(table, {
			columnsSize: [20, 45, 180, 180, 50, 35],
		  });
	
	
		  const buffer = []
		  doc.on('data', buffer.push.bind(buffer))
		  doc.on('end', () => {
			const data = Buffer.concat(buffer)
			resolve(data)
		  })
		  doc.end()
	
	
		})
	
		return pdfBuffer;
	
	}
}