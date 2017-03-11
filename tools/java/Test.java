import java.util.Date;

public class Test {

	public static void main(String[] args) {
		Date time = new Date();
		String s = time.toGMTString();

		for(String a : args) {
			s += " " + a;
		}

		System.out.println(s);
	}
}
