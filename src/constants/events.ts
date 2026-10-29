import type { WeddingEvent } from "@/types"

export type WeddingEventKey = "bridal" | "groom"

export const EVENTS: Record<WeddingEventKey, WeddingEvent> = {
  bridal: {
    title: 'LỄ VU QUY',
    location_line_1: 'Nhà Hàng Tiệc Cưới',
    location_line_2: 'Minh Thuỳ',
    date_lunar: '28-04',
    countdown: '2025-05-25T11:00:00',
    calendar_url:
      'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=NzdyNmlxOTN1MXNzbGgyNzQ5cmlwbGdhZDEgZmFtaWx5MTgzNTMzNzE1OTAyMDI4MDk0NDlAZw&tmsrc=family18353371590202809449%40group.calendar.google.com',
    map: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3268.371803254187!2d106.76661492495775!3d10.840675990304527!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527a87fcdb123%3A0xaeb846db7ee2f4ff!2sWedding%20Restaurant%20Minh%20Thuy!5e0!3m2!1sen!2sus!4v1746084474401!5m2!1sen!2sus',
    map_direction: 'https://www.google.com/maps/dir/?api=1&destination=Wedding+Restaurant+Minh+Thuy',
    // Word for word from the printed card.
    print: {
      crest: { names: ['Thế Phương', 'Hồng Trinh'], date: '25.05.25' },
      envelopeDate: '25.05.2025',
      families: [
        { parents: ['Nguyễn Hưởng Tiến Tài', 'Trần Thị Phượng'] },
        { parents: ['Phùng Văn Tài', 'Lê Thị Lịch'] },
      ],
      announcement: 'Trân Trọng Báo Tin Lễ Vu Quy Của Con Chúng Tôi',
      couple: [
        { surname: 'Nguyễn', given: 'Hồng Trinh', role: 'Út Nữ' },
        { surname: 'Phùng', given: 'Thế Phương', role: 'Quý Nam' },
      ],
      homeCeremony: {
        title: 'Hôn Lễ Được Cử Hành Tại Tư Gia',
        lines: ['Vào lúc 9h00', 'Chủ Nhật, ngày 25 tháng 5 năm 2025', '(Nhằm ngày 28 tháng 4 năm Ất Tỵ)'],
      },
      reception: {
        intro: 'Đến dự buổi tiệc chung vui cùng gia đình chúng tôi tại',
        venue: ['Nhà hàng tiệc cưới', 'Minh Thùy'],
        hall: 'Sảnh B',
        address: ['01- 02A Alexandre De Rhodes, Phường Bình Thọ,', 'TP. Thủ Đức, TP. Hồ Chí Minh'],
        time: 'Vào lúc 11h00',
        date: 'Chủ Nhật, 25.05.2025',
        lunar: '(Nhằm ngày 28 tháng 4 năm Ất Tỵ)',
        closing: ['Sự hiện diện của quý khách', 'là niềm vinh hạnh cho gia đình chúng tôi'],
        schedule: 'Đón khách: 11h00 - Khai tiệc: 12h00',
      },
    },
  },
  groom: {
    title: 'LỄ TÂN HÔN',
    location_line_1: 'Trường THCS Sông Hiến',
    location_line_2: 'Sân trường cấp 2',
    date_lunar: '21-05',
    countdown: '2025-06-16T16:30:00',
    calendar_url: 'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=MG8zbjlndWhqMG11Zm1kcXAxZDdkMzdwcTMgcGh1b25ndGhlcGh1bmdAbQ&tmsrc=phuongthephung%40gmail.com',
    map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1015.5796450271912!2d106.23863630730398!3d22.67521783603088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x36ca6685c0000001%3A0x4d035b7c00b2b825!2zVHLGsOG7nW5nIFRydW5nIEjhu41jIEPGoSBT4bufIFPDtG5nIEhp4bq_biAy!5e1!3m2!1sen!2s!4v1748312887751!5m2!1sen!2s',
    map_direction: 'https://www.google.com/maps/dir/?api=1&destination=Trường+Trung+Học+Cơ+Sở+Sông+Hiến+2',
    // Same design as the printed Vu Quy card, groom's family first.
    print: {
      crest: { names: ['Thế Phương', 'Hồng Trinh'], date: '16.06.25' },
      envelopeDate: '16.06.2025',
      families: [
        { parents: ['Phùng Văn Tài', 'Lê Thị Lịch'] },
        { parents: ['Nguyễn Hưởng Tiến Tài', 'Trần Thị Phượng'] },
      ],
      announcement: 'Trân Trọng Báo Tin Lễ Tân Hôn Của Con Chúng Tôi',
      couple: [
        { surname: 'Phùng', given: 'Thế Phương', role: 'Quý Nam' },
        { surname: 'Nguyễn', given: 'Hồng Trinh', role: 'Út Nữ' },
      ],
      // TODO(Trinh & Phương): giờ làm lễ tại tư gia nhà trai.
      homeCeremony: {
        title: 'Hôn Lễ Được Cử Hành Tại Tư Gia',
        lines: ['Thứ Hai, ngày 16 tháng 6 năm 2025', '(Nhằm ngày 21 tháng 5 năm Ất Tỵ)'],
      },
      reception: {
        intro: 'Đến dự buổi tiệc chung vui cùng gia đình chúng tôi tại',
        venue: ['Trường THCS Sông Hiến', 'Sân trường cấp 2'],
        address: ['Tổ 4, phường Sông Hiến, TP. Cao Bằng'],
        time: 'Vào lúc 16h30',
        date: 'Thứ Hai, 16.06.2025',
        lunar: '(Nhằm ngày 21 tháng 5 năm Ất Tỵ)',
        closing: ['Sự hiện diện của quý khách', 'là niềm vinh hạnh cho gia đình chúng tôi'],
        // TODO(Trinh & Phương): giờ đón khách / khai tiệc.
      },
    },
  },
}
