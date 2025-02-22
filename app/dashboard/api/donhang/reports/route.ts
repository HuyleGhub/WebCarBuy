import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET() {
  try {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { 
              font-family: 'Time New Roman', Times, serif;
              margin: 20px;
              font-size: 16px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              font-weight: bold;
              font-size: 20px;
              margin-bottom: 30px;
            }
            .section {
              margin-bottom: 25px;
            }
            .section strong {
              font-size: 18px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #000;
              padding: 10px;
              text-align: left;
            
            }
            th {
              background-color: #0000FF;
              color: #FFFFFF;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
              text-align: center;
            }
            .signature-block {
              width: 45%;
              padding: 20px;
            }
            .signature-line {
              margin-top: 50px;
              border-top: 1px solid #000;
            }
          </style>
        </head>
        <body>
          <div class="header">
            HỢP ĐỒNG MUA BÁN XE Ô TÔ<br>
            Số: _______________
          </div>
          
          <div>Ký ngày _____ tháng _____ năm _____, giữa:</div>
          
          <div class="section">
            <strong>BÊN BÁN:</strong>
            <p>Địa chỉ trụ sở chính: ________________________________</p>
            <p>Mã số doanh nghiệp: ________________________________</p>
            <p>Tài khoản: ________________________________________</p>
            <p>Đại diện: _________________________________________</p>
            <p>Chức vụ: _________________________________________</p>
            <p>(Theo Giấy uỷ quyền số:_______ ngày_____ tháng_____ năm_____)</p>
          </div>

          <div class="section">
            <strong>BÊN MUA:</strong>
            <p>Địa chỉ: ________________________________________</p>
            <p>Điện thoại: _____________________________________</p>
            <p>CMTND/TCC: Số_________ cấp ngày_______ bởi_______</p>
            <p>Mã số thuế: _____________________________________</p>
            <p>Đại diện: _______________________________________</p>
            <p>Chức vụ: ________________________________________</p>
          </div>

          <div class="section">
            <strong>ĐIỀU 1. TÊN HÀNG – CHẤT LƯỢNG – SỐ LƯỢNG - GIÁ TRỊ HỢP ĐỒNG</strong>
            <table>
              <tr>
                <th>Tên Hàng</th>
                <th>Phiên bản</th>
                <th>Màu ngoại thất</th>
                <th>Màu nội thất</th>
                <th>Số lượng</th>
                <th>Giá bán VNĐ</th>
              </tr>
              <tr>
                <td>Vinfast ...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
              </tr>
              <tr>
                <td colspan="5">Tổng giá trị hợp đồng:</td>
                <td>(Bằng chữ: ..............................)</td>
              </tr>
            </table> <br>

            <p> Xe mới 100%, các thông số kỹ thuật: Theo tiêu chuẩn của Nhà sản xuất – Công ty cổ phần Sản xuất và 
Kinh doanh VinFast <strong>(“VinFast”).</strong></p>
            <p> Giá bán nêu trên đã bao gồm thuế tiêu thụ đặc biệt, thuế giá trị gia tăng (VAT), nhưng không bao gồm lệ 
phí trước bạ, chi phí đăng ký, lưu hành, bảo hiểm xe và các chi phí khác. Giá bán nêu trên cũng có thể điều 
chỉnh tùy thuộc vào chính sách thuế (nếu có). Trường hợp Bên Bán phải điều chỉnh giá bán theo chính sách 
thuế mới thì hai bên sẽ ký phụ lục sửa đổi Hợp Đồng theo giá bán mới. </p>

          </div>

          <!-- Contract terms sections - abbreviated -->
          <div class="section">
            <strong>ĐIỀU 2. THANH TOÁN</strong>
            <p>1. Khách Hàng đặt cọc cho Bên Bán số tiền __________ VNĐ (bằng chữ: __________) trong vòng 03 (ba) ngày làm việc kể từ ngày ký Hợp Đồng này nhưng trong mọi trường hợp không 
muộn hơn thời hạn áp dụng của chính sách ưu đãi nêu tại Điều 1 trên đây. Nếu quá thời gian trên mà 
Bên Bán không nhận được đầy đủ tiền đặt cọc, Hợp Đồng này sẽ tự động hết hiệu lực. Số tiền còn 
lại của Hợp Đồng sẽ được Khách Hàng thanh toán đầy đủ cho Bên Bán trong thời hạn 05 (năm) ngày 
làm việc kể từ ngày nhận được thông báo từ Bên Bán về việc Xe sẵn có để giao cho Khách Hàng và 
trong mọi trường hợp phải trước thời điểm nhận xe. Quá thời hạn này mà Khách Hàng chưa thực 
hiện đầy đủ nghĩa vụ thanh toán, Bên Bán có quyền chấm dứt Hợp đồng và khoản tiền đặt cọc nêu 
trên sẽ thuộc về Bên Bán. Sau khi đã nhận đầy đủ số tiền theo Hợp Đồng này, Bên Bán sẽ xuất hóa 
đơn và bàn giao đầy đủ giấy tờ cho Khách Hàng.</p>
            <p>2. Khách Hàng thanh toán cho Bên Bán bằng VNĐ theo một trong các hình thức sau:</p>
            <p>   a. Chuyển khoản vào tài khoản của Bên Bán theo thông tin nêu tại phần đầu Hợp Đồng. Mọi chi 
phí liên quan đến việc chuyển khoản do Khách Hàng chịu. </p> 
          <p>   b. Thanh toán bằng tiền mặt tại Showroom của Bên Bán. Khách Hàng thanh toán tiền mặt tại 
Quầy thu ngân và nhận Phiếu thu của Bên Bán. Phiếu thu hợp lệ là Phiếu thu còn nguyên trạng, 
không có dấu vết tẩy xóa, không viết tay, được ký bởi Thủ quỹ, Người đại diện của Bên Bán 
(có tên nêu tại phần đầu của Hợp Đồng này) và đóng dấu bởi Bên Bán. </p> 
          <p>   c. Riêng đối với tiền đặt cọc, Khách Hàng có thể thanh toán bằng thẻ ngân hàng. Chi phí liên 
quan đến việc thanh toán bằng thẻ do Bên Bán chịu.</p> 
          </div>

          <div class="section">
            <strong>ĐIỀU 3. THỜI GIAN, ĐỊA ĐIỂM VÀ PHƯƠNG THỨC GIAO HÀNG</strong>
            <p>1. Thời gian giao xe: theo thông báo bằng văn bản của Bên Bán tới Khách Hàng trước 05 (năm) ngày làm việc.</p>
            <p>2. Bên Bán sẽ bàn giao Xe cho Khách Hàng sau khi nhận đủ 100% Tổng giá trị Hợp Đồng bằng một 
thông báo bàn giao Xe cho Khách Hàng. Quá thời hạn bàn giao xe theo thông báo của Bên Bán, nếu 
Khách Hàng vẫn chưa thực hiện nghĩa vụ nhận xe thì Bên Bán, theo quyết định của mình có quyền 
đơn phương chấm dứt Hợp Đồng này và thực hiện các hành động sau:</p>
            <p>   (i) Trường hợp khách hàng chưa thanh toán Tổng giá trị Hợp Đồng: khoản tiền đặt cọc quy định 
tại Điều 2 sẽ thuộc về Bên Bán.</p>
            <p>   (ii)Trường hợp khách hàng đã thanh toán Tổng giá trị Hợp Đồng: Khách Hàng có trách nhiệm 
thanh toán cho Bên Bán chi phí lưu giữ xe (mức phí do Bên Bán quy định) nhưng tối đa không 
quá 30 (ba mươi) ngày kể từ thời hạn bàn giao xe theo thông báo của Bên Bán. Quá thời hạn 
này, Khách Hàng đồng ý để Bên Bán xử lý xe theo quy định của pháp luật đối với tài sản vô 
chủ. </p>
            <p>3. Địa điểm giao nhận xe là tại trụ sở Bên Bán hoặc một trong những cơ sở gần nhất của Bên Bán do 
Bên Bán chỉ định.</p>
            <p>4. Bên Bán sẽ giao xe và các giấy tờ  chuyển quyền sở hữu trực tiếp cho Khách Hàng hoặc người được 
Khách Hàng ủy quyền. Người được Khách Hàng ủy quyền phải xuất trình giấy ủy quyền hợp lệ và 
CMND hoặc giấy tờ tương đương. </p>
          </div>

          <div class="section">
            <strong>ĐIỀU 4. BẢO HÀNH</strong>
            <p>Thông tin về bảo hành theo điều khoản bảo hành quy định tại sổ bảo hành do Bên Bán cung cấp cho Khách 
Hàng.</p>
          </div>

          <div class="section">
            <strong>ĐIỀU 5. TRÁCH NHIỆM CỦA CÁC BÊN</strong>
            <p>1. Bên Bán có nghĩa vụ giao xe theo quy định trong Hợp Đồng này, trừ trường hợp bất khả kháng.</p>
          <p>2. Bên Bán có nghĩa vụ cung cấp đầy đủ hóa đơn, chứng từ, tài liệu hợ lệ cho Khách Hàng. </p>
          <p>3. Khách Hàng có trách nhiệm thanh toán và nhận xe theo đúng thời gian đã quy định và chịu mọi chi
phí liên quan đến thủ tục đăng ký, lưu hành và bảo hiểm xe. </p>
          <p>4. Khách Hàng đồng ý cho Bên Bán được lưu trữ, xử lý, chia sẻ dữ liệu thông tin cá nhân của Khách
Hàng theo Chính sách Quyền riêng tư đối với Khách Hàng của Bên Bán công bố trên website tại </p>
          <p>https://vinfastauto.com/vi/dieu-khoan-phap-ly theo từng thời điểm. Chính sách Quyền riêng tư đối 
với Khách Hàng là một phần không tách rời của Hợp Đồng này.  </p>
          </div>

          <div class="section">
            <strong>ĐIỀU 6. BẤT KHẢ KHÁNG</strong>
            <p>1. Bất khả kháng có nghĩa là bất kỳ sự kiện nào dưới đây ngăn trở VinFast sản xuất/Bên Bán giao sản 
phẩm được nêu trong Hợp Đồng này: chiến tranh, nổi dậy, đình công, tranh chấp lao động; hỏa hoạn, 
lũ lụt hoặc thiên tai; thiếu hụt nhân lực, nguyên vật liệu, phương tiện vận chuyển hoặc tiện ích; chậm 
trễ cung cấp nguyên vật liệu nào từ nhà cung cấp; quy định của nhà nước; hoặc hoàn cảnh tương tự.</p>
<p>2. Khi xảy ra sự kiện bất khả kháng, bên gặp phải bất khả kháng không được phép chậm trễ, phải thông 
báo cho bên kia tình trạng thực tế, đề xuất phương án xử lý và nỗ lực giảm thiểu tổn thất đến mức 
thấp nhất có thể. </p>
          </div>

          <div class="section">
            <strong>ĐIỀU 7. ĐIỀU KHOẢN CHUNG</strong>
           <p>1. Bên Bán có quyền chuyển giao Hợp Đồng này cho công ty con/liên kết của mình hoặc công ty mới 
thành lập do tái cơ cấu Bên Bán (chia, tách, hợp nhất, sáp nhập v.v.) hoặc bên thứ ba sau khi gửi cho 
Khách Hàng thông báo bằng văn bản ít nhất 05 (năm) ngày làm việc trước ngày chuyển giao.</p>
<p>2. Mọi tranh chấp liên quan đến Hợp ồng nếu không được giải quyết thông qua thương lượng thì sẽ
được giải quyết tại tòa án có thẩm quyền.</p>
<p>3. Hợp Đồng này có hiệu lực kể từ ngày ký và được lập thành 04 (bốn) bản, mỗi bên giữ 02 (hai) bản. </p>
          </div>

          <div class="signatures">
            <div class="signature-block">
              <strong>ĐẠI DIỆN KHÁCH HÀNG</strong>
              <div class="signature-line"></div>
              <p>(Ký và ghi rõ họ tên)</p>
            </div>
            <div class="signature-block">
              <strong>ĐẠI DIỆN BÊN BÁN</strong>
              <div class="signature-line"></div>
              <p>(Ký, đóng dấu và ghi rõ họ tên)</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=hopdong-mua-ban.pdf',
      },
    });
  } catch (error) {
    console.error('Error generating contract PDF:', error);
    return NextResponse.json({ message: 'Error generating contract PDF' }, { status: 500 });
  }
}